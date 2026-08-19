const CACHE_NAME = 'darshan-patel-cache-v7';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/portfolio.html',
  '/blog.html',
  '/contact.html',
  '/css/style.css?v=1.1',
  '/css/components.css?v=1.1',
  '/css/portfolio-item.css',
  '/css/blog-post.css',
  '/js/script.js',
  '/assets/darshan-patel.webp',
  '/assets/micro_interactions.webp',
  '/assets/microservices.webp',
  '/assets/react_rendering.webp',
  '/assets/tech_seo.webp',
  '/logos/1762175424244.png',
  '/logos/302194378_542139041043422_1744942393884331573_n-removebg-preview.png',
  '/logos/Asset_2_100x-8.avif',
  '/logos/Canvas-small.png',
  '/logos/Concur-media-white-orange-logo.png',
  '/logos/Decacorn-Logo-2.png',
  '/logos/LOGO (2).png',
  '/logos/LOGO.png',
  '/logos/ShantihramRegistered-scaled-300x98.png',
  '/logos/Trips-and-Joy-logo-w.png',
  '/logos/akua_logo_1da6e0a9-ccf2-4ff5-a977-1c2413f18433.avif',
  '/logos/als-main-logo.webp',
  '/logos/cropped-Jemi-SEO-Firm-India.png',
  '/logos/cropped-Untitled-design-12-1.png',
  '/logos/cropped-gr-icon-150x150.png',
  '/logos/gk-jewel-logo.webp',
  '/logos/logo (3).png',
  '/logos/logo (4).png',
  '/logos/logo-04.png',
  '/logos/logo.svg',
  '/logos/logo2.png',
  '/logos/pehrile-logo.avif',
  '/logos/quickcarto_logo.avif',
  '/logos/vasudev_engineering__1_-removebg-preview.png'
];

// Install Event - Pre-cache critical static shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching static app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache storage:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve cached assets or fetch from network
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Focus only on local HTTP/HTTPS requests
  if (event.request.url.startsWith(self.location.origin)) {
    
    // Cache strategy: Cache-First for local images
    if (
      requestUrl.pathname.includes('/assets/') || 
      requestUrl.pathname.includes('/logos/') || 
      requestUrl.pathname.endsWith('.webp') || 
      requestUrl.pathname.endsWith('.png') || 
      requestUrl.pathname.endsWith('.jpg') || 
      requestUrl.pathname.endsWith('.jpeg') || 
      requestUrl.pathname.endsWith('.svg') ||
      requestUrl.pathname.endsWith('.avif')
    ) {
      event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(response => {
            if (response) {
              return response; // Instant return from cache
            }
            return fetch(event.request).then(networkResponse => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
      );
    } 
    // Cache strategy: Network-First for HTML pages (so users always see latest content when online)
    else if (
      event.request.headers.get('accept')?.includes('text/html') || 
      requestUrl.pathname.endsWith('.html') || 
      requestUrl.pathname === '/' || 
      !requestUrl.pathname.split('/').pop().includes('.')
    ) {
      event.respondWith(
        fetch(event.request)
          .then(networkResponse => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return caches.open(CACHE_NAME).then(cache => cache.match(event.request));
          })
      );
    }
    // Cache strategy: Stale-While-Revalidate for CSS and JS
    else {
      event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
              // Ensure valid response to prevent caching errors
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            }).catch(() => {
              // Graceful offline fallback
              return cachedResponse;
            });
            return cachedResponse || fetchPromise;
          });
        })
      );
    }
  } 
  // Cache strategy: Stale-While-Revalidate for external CDNs (Fonts, FontAwesome)
  else if (event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com') || event.request.url.includes('cdnjs.cloudflare.com') || event.request.url.includes('unpkg.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});

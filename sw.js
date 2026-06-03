const CACHE_NAME = 'darshan-patel-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/portfolio.html',
  '/blog.html',
  '/contact.html',
  '/css/style.css',
  '/css/components.css',
  '/css/portfolio-item.css',
  '/css/blog-post.css',
  '/js/script.js',
  '/assets/darshan-patel.webp',
  '/assets/micro_interactions.webp',
  '/assets/microservices.webp',
  '/assets/react_rendering.webp',
  '/assets/tech_seo.webp'
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
    if (requestUrl.pathname.includes('/assets/') || requestUrl.pathname.endsWith('.webp') || requestUrl.pathname.endsWith('.png') || requestUrl.pathname.endsWith('.jpg') || requestUrl.pathname.endsWith('.svg')) {
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
    // Cache strategy: Stale-While-Revalidate for CSS, JS, and HTML pages
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

document.addEventListener('DOMContentLoaded', () => {
    // Current Year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open and add menu-open class for CSS hooks
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                document.body.classList.add('menu-open');
            } else {
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
            }

            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // Live Local Time in Ahmedabad
    const timeElement = document.getElementById('local-time');
    function updateTime() {
        if (!timeElement) return;
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const timeString = new Intl.DateTimeFormat('en-US', options).format(new Date());
        timeElement.textContent = `${timeString} IND`;
    }
    updateTime();
    setInterval(updateTime, 1000);

    // GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    // Animate Bento Modules on load
    gsap.fromTo('.bento-module', 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        }
    );

    // Counter Animation for Experience
    const counter = document.querySelector('.counter');
    if(counter) {
        gsap.to(counter, {
            scrollTrigger: {
                trigger: '.exp-module',
                start: "top 85%"
            },
            textContent: counter.getAttribute('data-target'),
            duration: 2,
            snap: { textContent: 1 },
            ease: "power2.out"
        });
    }

    // Fade up animations for sections
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 30, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // ---- Portfolio Stack Filter ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pCards = document.querySelectorAll('.grid-card, .p-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            pCards.forEach(card => {
                const category = card.getAttribute('data-category') || card.dataset.stack || '';
                if (filter === 'all' || category === filter || category.split(' ').includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Refresh ScrollTrigger to fix blank page issue after layout change
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 100);
            }
        });
    });
});


/* --- Page Specific Scripts --- */

/* --- Script from index.html --- */
document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById("globe-container");
            if (container) {
                // Determine container width for initial setup
                const width = container.offsetWidth || 300;
                const height = container.offsetHeight || 300;

                const globe = Globe()
                    (container)
                    .width(width)
                    .height(height)
                    .backgroundColor('rgba(0,0,0,0)')
                    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg') // Much clearer map with city lights
                    .showAtmosphere(true)
                    .atmosphereColor('#1e40af')
                    .atmosphereAltitude(0.2)
                    .htmlElementsData([
                        { lat: 23.0225, lng: 72.5714 } // Ahmedabad
                    ])
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.innerHTML = `
                            <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
                                <div style="position: absolute; width: 40px; height: 40px; background: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: pulse 2s infinite;"></div>
                                <span style="font-size: 28px; filter: drop-shadow(0 0 15px rgba(255, 234, 0, 0.8)); z-index: 1;">👋</span>
                            </div>
                        `;
                        return el;
                    });

                // Configure rotation and initial position
                globe.controls().autoRotate = true;
                globe.controls().autoRotateSpeed = 0.2; // VERY slow so it stays on Ahmedabad when loaded
                globe.controls().enableZoom = false; // Disabled user zoom functionality to fix scrolling issues

                // Point camera to India initially, perfect view of the world centered on Ahmedabad
                globe.pointOfView({ lat: 23.0225, lng: 72.5714, altitude: 2.2 }, 1000);

                // Handle resize
                window.addEventListener('resize', () => {
                    if (container.offsetWidth && container.offsetHeight) {
                        globe.width(container.offsetWidth).height(container.offsetHeight);
                    }
                });
            }
        });

/* --- Script from portfolio.html --- */
document.addEventListener('DOMContentLoaded', () => {
            const filterBtns = document.querySelectorAll('.cat-btn');
            const gridCards = document.querySelectorAll('.grid-card');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const f = btn.getAttribute('data-filter');
                    gridCards.forEach(card => {
                        card.classList.toggle('hidden', f !== 'all' && card.getAttribute('data-category') !== f);
                    });
                });
            });
        });

/* --- Script from about.html --- */
// Generate Premium Github-inspired graph
        document.addEventListener('DOMContentLoaded', () => {
            const graph = document.getElementById('contribGraph');
            const weeks = 48; // Fit comfortably in container
            const classes = ['', 'sq-1', 'sq-2', 'sq-3', 'sq-4'];

            for (let i = 0; i < weeks; i++) {
                const col = document.createElement('div');
                col.className = 'graph-col';

                for (let j = 0; j < 7; j++) {
                    let rand = Math.random();
                    let level = 0;
                    if (rand > 0.4) level = 1;
                    if (rand > 0.7) level = 2;
                    if (rand > 0.85) level = 3;
                    if (rand > 0.95) level = 4;

                    const square = document.createElement('div');
                    square.className = `graph-sq ${classes[level]}`;
                    col.appendChild(square);
                }
                graph.appendChild(col);
            }
        });

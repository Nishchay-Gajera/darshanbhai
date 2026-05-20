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

    // GSAP Scroll Animations (only if GSAP is available)
    if (typeof gsap !== 'undefined') {
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
    } else {
        // Fallback: just show elements if GSAP not available
        document.querySelectorAll('.fade-in, .bento-module').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

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

    // ---- Interactive Terminal CLI logic ----
    const terminalInput = document.querySelector('.terminal-input');
    const terminalLog = document.querySelector('.terminal-log');
    const terminalOutput = document.querySelector('.terminal-output');
    const ideTabs = document.querySelectorAll('.ide-tab');
    const tabContents = document.querySelectorAll('.ide-tab-content');

    // Tab Switching
    if (ideTabs.length > 0) {
        ideTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                ideTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                tabContents.forEach(content => {
                    if (content.id === `tab-${target}`) {
                        content.style.display = target === 'terminal' ? 'flex' : 'block';
                        if (target === 'terminal' && terminalInput) {
                            setTimeout(() => terminalInput.focus(), 100);
                        }
                    } else {
                        content.style.display = 'none';
                    }
                });
            });
        });
    }

    // Command parser
    if (terminalInput && terminalLog) {
        const commands = {
            help: () => `
                <div style="color: #60a5fa; font-weight: bold;">Available Commands:</div>
                <div style="margin-left: 10px;">• <span style="color: #f59e0b;">about</span>    - Learn more about who I am</div>
                <div style="margin-left: 10px;">• <span style="color: #f59e0b;">skills</span>   - List core technologies and tools</div>
                <div style="margin-left: 10px;">• <span style="color: #f59e0b;">projects</span> - View my key engineering projects</div>
                <div style="margin-left: 10px;">• <span style="color: #f59e0b;">contact</span>  - Get my direct contact coordinates</div>
                <div style="margin-left: 10px;">• <span style="color: #f59e0b;">clear</span>    - Purge terminal output console</div>
            `,
            about: () => `
                <p>Hello! I am <span style="color: #3b82f6; font-weight: bold;">Darshan Patel</span>.</p>
                <p>I am a <span style="color: #f59e0b;">Senior Full-Stack Engineer</span> based in Ahmedabad, India, with over 10 years of experience building high-performance, conversion-focused websites, custom plugins, and responsive web applications.</p>
                <p>I bridge the gap between technical execution and business value. I design elegant, scalable architecture that helps businesses scale effortlessly.</p>
            `,
            skills: () => `
                <div style="color: #60a5fa; font-weight: bold; margin-bottom: 5px;">Core Tech Competencies:</div>
                <div style="display: grid; grid-template-columns: 120px 1fr; gap: 5px; margin-left: 10px;">
                    <span style="color: #a78bfa; font-weight: bold;">Frontend:</span> <span>React, JavaScript (ES6+), HTML5, CSS3, TailwindCSS</span>
                    <span style="color: #a78bfa; font-weight: bold;">Backend:</span> <span>Node.js, Express, REST APIs, PHP, MySQL</span>
                    <span style="color: #a78bfa; font-weight: bold;">CMS/Platform:</span> <span>WordPress, Custom Theme & Plugin Development, WooCommerce</span>
                    <span style="color: #a78bfa; font-weight: bold;">Systems/SEO:</span> <span>Technical SEO, Website Performance Tuning, AWS Infrastructure</span>
                </div>
            `,
            projects: () => `
                <div style="color: #60a5fa; font-weight: bold; margin-bottom: 5px;">Key Projects Summary:</div>
                <div style="margin-left: 10px; margin-bottom: 8px;">
                    • <span style="color: #f59e0b; font-weight: bold;">Custom Bento Portfolio</span> - A highly-responsive, micro-animated single page dashboard application.
                </div>
                <div style="margin-left: 10px; margin-bottom: 8px;">
                    • <span style="color: #f59e0b; font-weight: bold;">E-Commerce Scaling Engine</span> - Boosted client WooCommerce page-load time by 60% and sales conversions by 28%.
                </div>
                <div style="margin-left: 10px;">
                    • <span style="color: #f59e0b; font-weight: bold;">SaaS Billing Portal</span> - Architected secure Node.js billing integration handling thousands of concurrent users.
                </div>
            `,
            contact: () => `
                <p style="color: #60a5fa; font-weight: bold;">Drop me a line & let's build something scalable:</p>
                <p style="margin-left: 10px;">• Email: <a href="mailto:info@darshanpatel.info" style="color: #10b981; text-decoration: underline;">info@darshanpatel.info</a></p>
                <p style="margin-left: 10px;">• Web: <a href="index.html#contact" style="color: #10b981; text-decoration: underline;">darshanpatel.info/contact</a></p>
            `,
            clear: () => {
                terminalLog.innerHTML = '';
                return '';
            }
        };

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const inputValue = terminalInput.value.trim().toLowerCase();
                terminalInput.value = '';

                // Log the typed command
                const commandLine = document.createElement('div');
                commandLine.style.marginBottom = '10px';
                commandLine.innerHTML = `<span style="color: #3b82f6; font-weight: bold;">guest@darshanpatel:~$</span> <span style="color: #fff;">${inputValue}</span>`;
                terminalLog.appendChild(commandLine);

                // Process command
                if (inputValue) {
                    const outputLine = document.createElement('div');
                    outputLine.style.marginBottom = '15px';
                    outputLine.style.color = '#d1d5db';

                    if (commands[inputValue]) {
                        const result = commands[inputValue]();
                        if (result) {
                            outputLine.innerHTML = result;
                            terminalLog.appendChild(outputLine);
                        }
                    } else {
                        outputLine.innerHTML = `<span style="color: #ef4444;">Command not found: '${inputValue}'. Type 'help' to see available commands.</span>`;
                        terminalLog.appendChild(outputLine);
                    }
                }

                // Scroll to bottom
                if (terminalOutput) {
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }
            }
        });

        // Click terminal body to focus input
        const tabTerminal = document.getElementById('tab-terminal');
        if (tabTerminal) {
            tabTerminal.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }

    // ---- Subtle Magnetic Buttons (primary CTAs only) ----
    const magneticElements = document.querySelectorAll('.btn-primary.magnetic');
    if (magneticElements.length > 0 && typeof gsap !== 'undefined') {
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const bounds = el.getBoundingClientRect();
                const centerX = bounds.left + bounds.width / 2;
                const centerY = bounds.top + bounds.height / 2;
                const deltaX = (e.clientX - centerX) * 0.25;
                const deltaY = (e.clientY - centerY) * 0.25;
                
                gsap.to(el, {
                    x: deltaX,
                    y: deltaY,
                    ease: "power2.out",
                    duration: 0.4,
                    overwrite: "auto"
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    ease: "power3.out",
                    duration: 0.5,
                    overwrite: "auto"
                });
            });
        });
    }

});
// End of main DOMContentLoaded block


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
    if (filterBtns.length > 0) {
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
    }
});

/* --- Script from about.html --- */
// Generate Premium Github-inspired graph dynamically based on viewport size
document.addEventListener('DOMContentLoaded', () => {
    const graph = document.getElementById('contribGraph');
    if (!graph) return;

    function drawGraph() {
        graph.innerHTML = '';
        
        let weeks = 48;
        if (window.innerWidth < 360) {
            weeks = 13; // Super clean fit for very narrow screens (prevents scroll/overflow entirely)
        } else if (window.innerWidth < 480) {
            weeks = 18; // Clean fit for narrow mobile screens
        } else if (window.innerWidth < 768) {
            weeks = 28; // Clean fit for standard mobile/tablets
        } else if (window.innerWidth < 1024) {
            weeks = 36; // Clean fit for larger tablets
        }

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
    }

    drawGraph();

    // Handle redraw on resize with simple debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(drawGraph, 200);
    });
});

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
                <p>I am a <span style="color: #f59e0b;">Freelance Consultant & Full-Stack Developer</span> based in Ahmedabad, India. I specialize in designing and developing scalable backend systems, custom business websites, eCommerce platforms, and cloud infrastructure.</p>
                <p>With a strong track record of serving 20+ global clients, I partner with businesses to establish, optimize, and scale their online presence through high-performance software engineering, cloud solutions, and digital growth strategies.</p>
            `,
            skills: () => `
                <div style="color: #60a5fa; font-weight: bold; margin-bottom: 5px;">Core Tech Competencies:</div>
                <div style="display: grid; grid-template-columns: 120px 1fr; gap: 5px; margin-left: 10px;">
                    <span style="color: #a78bfa; font-weight: bold;">Languages:</span> <span>TypeScript, JavaScript, PHP</span>
                    <span style="color: #a78bfa; font-weight: bold;">Frontend:</span> <span>React.js, HTML5, CSS3</span>
                    <span style="color: #a78bfa; font-weight: bold;">Backend:</span> <span>Node.js, NestJS, RESTful APIs</span>
                    <span style="color: #a78bfa; font-weight: bold;">Databases:</span> <span>MongoDB, MySQL</span>
                    <span style="color: #a78bfa; font-weight: bold;">Platforms/CMS:</span> <span>WordPress, Google Workspace</span>
                    <span style="color: #a78bfa; font-weight: bold;">DevOps/Growth:</span> <span>AWS Cloud, SEO, SMM</span>
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



// Register Service Worker for Extreme Caching, Instant Page Loads, and Offline Capability
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Resolve Service Worker path dynamically based on whether we are in a subdirectory
        const isSubdirectory = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/portfolio/');
        const swPath = isSubdirectory ? '../sw.js' : 'sw.js';
        navigator.serviceWorker.register(swPath)
            .then(reg => {
                console.log('[Service Worker] Active scope:', reg.scope);
            })
            .catch(err => {
                console.error('[Service Worker] Registration failed:', err);
            });
    });
}

/* --- Premium Non-Server SMTP Contact Form Integration --- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create and attach Toast container to the DOM if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Function to trigger a beautiful toast notification
    window.showToast = function(title, message, type = 'success', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        let iconClass = 'fa-solid fa-circle-check';
        if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
        if (type === 'info') iconClass = 'fa-solid fa-circle-info';

        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow & slide-in
        setTimeout(() => toast.classList.add('show'), 50);
        
        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, duration);
    };

    // 2. Dynamic loader for SMTPJS script
    function loadSMTPJS() {
        return new Promise((resolve, reject) => {
            if (window.Email) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://smtpjs.com/v3/smtp.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load email service library.'));
            document.head.appendChild(script);
        });
    }

    // 3. Form Submission Handling
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        // Remove the inline onsubmit attribute if it exists
        form.removeAttribute('onsubmit');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const messageInput = form.querySelector('textarea');
            
            if (!nameInput || !emailInput || !messageInput || !submitBtn) return;
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            // Premium visual feedback: disable form and show loader
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
            nameInput.disabled = true;
            emailInput.disabled = true;
            messageInput.disabled = true;
            
            try {
                // Load SMTPJS client library dynamically
                await loadSMTPJS();
                
                /**
                 * ==========================================
                 * SMTPJS CONFIGURATION & ROBUST DELIVERY
                 * ==========================================
                 * Note: To prevent SPF/DKIM authentication failures, standard SMTP delivery 
                 * should send emails FROM a verified email domain owned by the website (e.g. info@darshanpatel.info).
                 * We set the customer's email in the message body and use it for Reply-To so you can reply directly!
                 * 
                 * You can configure your credentials below:
                 * - Option A (Recommended & Secure): Use a SecureToken from https://smtpjs.com
                 * - Option B: Use raw Host, Username, and Password.
                 */
                const emailConfig = {
                    // Option A: Secure token (highly recommended)
                    SecureToken: "YOUR_SMTPJS_SECURE_TOKEN_HERE",
                    
                    // Option B (Fallback if not using SecureToken):
                    // Host: "smtp.yourprovider.com",
                    // Username: "your_username",
                    // Password: "your_password",
                    
                    To: 'info@darshanpatel.info',            // Your inbox where you want to receive leads
                    From: 'info@darshanpatel.info',          // A verified sender email address on your SMTP server
                    Subject: `New Inquiry from ${name} | Darshan Patel Info`,
                    Body: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
                            <h2 style="color: #EA580C; margin-bottom: 20px; font-weight: bold; border-bottom: 2px solid #EA580C; padding-bottom: 10px;">New Contact Lead</h2>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #EA580C;">
                                <p style="margin-top: 0; font-weight: bold; color: #555;">Message:</p>
                                <p style="white-space: pre-wrap; line-height: 1.6; color: #444; margin-bottom: 0;">${message}</p>
                            </div>
                            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
                            <p style="font-size: 0.8rem; color: #888; text-align: center; margin-top: 15px;">Submitted via darshanpatel.info contact form.</p>
                        </div>
                    `
                };
                
                // If using SecureToken placeholder or is not yet configured, we will emulate a successful delivery and notify them how to set their token!
                if (emailConfig.SecureToken === "YOUR_SMTPJS_SECURE_TOKEN_HERE" && !emailConfig.Host) {
                    // Simulating for demo & guide mode so the UI is immediately fully functional and guides them
                    console.log("SMTP Configured with default placeholders. Form data:", { name, email, message });
                    
                    setTimeout(() => {
                        // Success toast showing standard feedback
                        window.showToast(
                            "Message Sent!", 
                            "Thanks for reaching out, Darshan will connect with you soon.", 
                            "success"
                        );
                        
                        // Information/guidance toast for setting up credentials
                        setTimeout(() => {
                            window.showToast(
                                "SMTP Action Required", 
                                "To receive actual emails, replace 'YOUR_SMTPJS_SECURE_TOKEN_HERE' in js/script.js with your token.", 
                                "info",
                                8000
                            );
                        }, 2500);
                        
                        // Reset form
                        form.reset();
                        
                        // Restore buttons
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHTML;
                        nameInput.disabled = false;
                        emailInput.disabled = false;
                        messageInput.disabled = false;
                    }, 1500);
                    
                    return;
                }
                
                // Send via SMTPJS
                const response = await window.Email.send(emailConfig);
                
                if (response === 'OK') {
                    window.showToast("Message Sent!", "Thank you. Your message has been sent successfully.", "success");
                    form.reset();
                } else {
                    console.error("SMTPJS Response Error:", response);
                    window.showToast("Sending Failed", `Could not send message: ${response}`, "error");
                }
            } catch (err) {
                console.error("Error during contact submission:", err);
                window.showToast("Error Occurred", "There was a network or configuration error. Please try again.", "error");
            } finally {
                // Restore form elements and original button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                nameInput.disabled = false;
                emailInput.disabled = false;
                messageInput.disabled = false;
            }
        });
    });
});

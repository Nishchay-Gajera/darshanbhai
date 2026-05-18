document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

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
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in animations for bento boxes
    const fadeElements = document.querySelectorAll('.fade-in');

    fadeElements.forEach((el, index) => {
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

    // Animate the huge text number
    gsap.fromTo('.huge-text',
        { textContent: 0 },
        {
            textContent: 10,
            duration: 2,
            snap: { textContent: 1 },
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.exp-box',
                start: "top 80%"
            }
        }
    );
});

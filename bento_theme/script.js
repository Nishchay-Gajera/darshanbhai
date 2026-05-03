document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

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

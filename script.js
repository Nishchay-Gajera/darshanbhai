document.addEventListener('DOMContentLoaded', () => {
    // Current Year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
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
    const pCards = document.querySelectorAll('.p-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            pCards.forEach(card => {
                const stacks = card.dataset.stack || '';
                if (filter === 'all' || stacks.split(' ').includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
});

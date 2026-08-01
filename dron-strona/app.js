gsap.registerPlugin(ScrollTrigger);

// Płynne zniknięcie głównego logo podczas scrollowania w dół
gsap.to(".branding", {
    opacity: 0,
    y: -100,
    scrollTrigger: {
        trigger: ".header-layer",
        start: "top top",
        end: "bottom center",
        scrub: 1
    }
});

// Efekt "ujawniania" kolejnych kart tekstowych z delikatnym podnoszeniem
document.querySelectorAll(".fade-section").forEach((section) => {
    const box = section.querySelector(".content-box");
    
    gsap.fromTo(box, 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top center+=100",
                end: "center center",
                scrub: 1
            }
        }
    );
});
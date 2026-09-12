/**
 * Homesick Sunday - Landing Page 2 Interactive Script
 * Vanilla JS recreation of landing_2.tsx interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initScrollAnimations();
    initVideoPlayer();
    initPersonelSlider();
    initOriginalsSlider();
    initHeroCarousel();
});

/* ========================================================================= */
/* 1. Smooth Scroll with Sticky Header Offset                                */
/* ========================================================================= */
function initSmoothScroll() {
    const navHeight = 75;
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').slice(1);
            if (!targetId) return;

            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================================================= */
/* 2. Scroll-triggered Fade-Up Animations (IntersectionObserver)             */
/* ========================================================================= */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    fadeElements.forEach(el => observer.observe(el));
}

/* ========================================================================= */
/* 3. Latest Video Player (Click-to-Play Embed)                              */
/* ========================================================================= */
function initVideoPlayer() {
    const wrapper = document.getElementById('video-thumbnail-wrapper');
    const container = document.getElementById('video-screen-container');
    if (!wrapper || !container) return;

    const ytId = wrapper.getAttribute('data-ytid');
    if (!ytId) return;

    wrapper.addEventListener('click', () => {
        container.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0" 
                title="Homesick Sunday Latest Video" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen 
                class="w-full h-full object-cover border-0"
            ></iframe>
        `;
    });
}

/* ========================================================================= */
/* 4. Personel Slider (Responsive Items & Touch Swipe)                       */
/* ========================================================================= */
function initPersonelSlider() {
    const track = document.getElementById('personel-track');
    const prevBtn = document.getElementById('personel-prev');
    const nextBtn = document.getElementById('personel-next');
    const dotsContainer = document.getElementById('personel-dots');
    const wrapper = document.getElementById('personel-slider-wrapper');
    if (!track || !prevBtn || !nextBtn) return;

    const slides = track.querySelectorAll('.personel-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;

    function getItemsPerView() {
        const w = window.innerWidth;
        if (w < 640) return 1;
        if (w < 1024) return 2;
        return 4;
    }

    function getGap() {
        const w = window.innerWidth;
        if (w < 640) return 16;
        if (w < 1280) return 18;
        return 24;
    }

    function getMaxIndex() {
        return Math.max(0, totalSlides - getItemsPerView());
    }

    function updateSlideWidths() {
        const itemsPerView = getItemsPerView();
        const gap = getGap();
        track.style.gap = `${gap}px`;
        slides.forEach(slide => {
            slide.style.width = `calc((100% - (${itemsPerView} - 1) * ${gap}px) / ${itemsPerView})`;
            slide.style.minWidth = `calc((100% - (${itemsPerView} - 1) * ${gap}px) / ${itemsPerView})`;
        });
    }

    function renderDots() {
        if (!dotsContainer) return;
        const maxIdx = getMaxIndex();
        dotsContainer.innerHTML = '';
        if (maxIdx <= 0) return;

        for (let i = 0; i <= maxIdx; i++) {
            const dot = document.createElement('button');
            dot.className = `h-2 transition-all duration-300 rounded-none border border-black ${
                currentIndex === i 
                    ? 'w-8 bg-[#ffea00] shadow-[2px_2px_0px_#ff0055]' 
                    : 'w-3 bg-white/30 hover:bg-white/50'
            }`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const itemsPerView = getItemsPerView();
        const gap = getGap();
        track.style.transform = `translateX(calc(-${currentIndex} * (100% + ${gap}px) / ${itemsPerView}))`;

        // Toggle navigation buttons container visibility when all cards fit on one screen
        const navContainer = prevBtn.parentElement;
        if (navContainer) {
            navContainer.style.display = maxIdx <= 0 ? 'none' : 'flex';
        }

        // Update Prev Button
        if (currentIndex === 0) {
            prevBtn.disabled = true;
            prevBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-white/10 text-white/20 cursor-not-allowed bg-black/40';
        } else {
            prevBtn.disabled = false;
            prevBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-[#ffea00] text-black bg-[#ffea00] shadow-[3px_3px_0px_#ff0055] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer';
        }

        // Update Next Button
        if (currentIndex >= maxIdx) {
            nextBtn.disabled = true;
            nextBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-white/10 text-white/20 cursor-not-allowed bg-black/40';
        } else {
            nextBtn.disabled = false;
            nextBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-[#ff0055] text-white bg-[#ff0055] shadow-[3px_3px_0px_#ffea00] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer';
        }

        renderDots();
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateSlider();
        }
    });

    // Touch Swipe Gesture Handling
    let touchStartX = null;
    let touchEndX = null;

    if (wrapper) {
        wrapper.addEventListener('touchstart', (e) => {
            touchEndX = null;
            touchStartX = e.targetTouches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            touchEndX = e.targetTouches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', () => {
            if (touchStartX === null || touchEndX === null) return;
            const distance = touchStartX - touchEndX;
            if (distance > 40 && currentIndex < getMaxIndex()) {
                currentIndex++;
                updateSlider();
            } else if (distance < -40 && currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
            touchStartX = null;
            touchEndX = null;
        });
    }

    // Resize Handler
    window.addEventListener('resize', () => {
        updateSlideWidths();
        updateSlider();
    });

    // Initial setup
    updateSlideWidths();
    updateSlider();
}

/* ========================================================================= */
/* 5. Originals Slider (Responsive Items & Touch Swipe)                      */
/* ========================================================================= */
function initOriginalsSlider() {
    const track = document.getElementById('originals-track');
    const prevBtn = document.getElementById('originals-prev');
    const nextBtn = document.getElementById('originals-next');
    const wrapper = document.getElementById('originals-slider-wrapper');
    if (!track || !prevBtn || !nextBtn) return;

    const slides = track.querySelectorAll('.originals-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;

    function getItemsPerView() {
        const w = window.innerWidth;
        if (w < 640) return 1;
        if (w < 1024) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, totalSlides - getItemsPerView());
    }

    function updateSlideWidths() {
        const itemsPerView = getItemsPerView();
        const gap = 24;
        slides.forEach(slide => {
            slide.style.width = `calc((100% - (${itemsPerView} - 1) * ${gap}px) / ${itemsPerView})`;
            slide.style.minWidth = `calc((100% - (${itemsPerView} - 1) * ${gap}px) / ${itemsPerView})`;
        });
    }

    function updateSlider() {
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const itemsPerView = getItemsPerView();
        const gap = 24;
        track.style.transform = `translateX(calc(-${currentIndex} * (100% + ${gap}px) / ${itemsPerView}))`;

        // Update Prev Button
        if (currentIndex === 0) {
            prevBtn.disabled = true;
            prevBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-white/10 text-white/20 cursor-not-allowed bg-black/40';
        } else {
            prevBtn.disabled = false;
            prevBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-[#ffea00] text-black bg-[#ffea00] shadow-[3px_3px_0px_#ff0055] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer';
        }

        // Update Next Button
        if (currentIndex >= maxIdx) {
            nextBtn.disabled = true;
            nextBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-white/10 text-white/20 cursor-not-allowed bg-black/40';
        } else {
            nextBtn.disabled = false;
            nextBtn.className = 'w-12 h-12 border-2 flex items-center justify-center font-mono-raw font-black text-lg transition-all duration-200 border-[#ff0055] text-white bg-[#ff0055] shadow-[3px_3px_0px_#ffea00] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer';
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateSlider();
        }
    });

    // Touch Swipe Gesture Handling
    let touchStartX = null;
    let touchEndX = null;

    if (wrapper) {
        wrapper.addEventListener('touchstart', (e) => {
            touchEndX = null;
            touchStartX = e.targetTouches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            touchEndX = e.targetTouches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', () => {
            if (touchStartX === null || touchEndX === null) return;
            const distance = touchStartX - touchEndX;
            if (distance > 40 && currentIndex < getMaxIndex()) {
                currentIndex++;
                updateSlider();
            } else if (distance < -40 && currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
            touchStartX = null;
            touchEndX = null;
        });
    }

    // Resize Handler
    window.addEventListener('resize', () => {
        updateSlideWidths();
        updateSlider();
    });

    // Initial setup
    updateSlideWidths();
    updateSlider();
}

/* ========================================================================= */
/* 6. Hero Carousel Support                                                  */
/* ========================================================================= */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    let isPaused = false;
    const heroSection = document.getElementById('hero');

    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => isPaused = true);
        heroSection.addEventListener('mouseleave', () => isPaused = false);
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
                slide.classList.add('opacity-100', 'z-10');
            } else {
                slide.classList.remove('opacity-100', 'z-10');
                slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
            }
        });
    }

    setInterval(() => {
        if (!isPaused) {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
    }, 5500);
}

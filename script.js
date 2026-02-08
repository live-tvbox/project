// --- নেভিগেশন কন্ট্রোল ---
const menuBtn = document.getElementById('menuBtn');
const cartBtn = document.getElementById('cartBtn');
const overlay = document.getElementById('overlay');

const closeAll = () => {
    document.getElementById('mobileSidebar')?.classList.add('-translate-x-full');
    document.getElementById('cartSidebar')?.classList.add('translate-x-full');
    document.getElementById('mobileSearchContainer')?.classList.add('hidden');
    overlay?.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

menuBtn?.addEventListener('click', () => {
    document.getElementById('mobileSidebar').classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

cartBtn?.addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

overlay?.addEventListener('click', closeAll);
document.getElementById('closeMenu')?.addEventListener('click', closeAll);
document.getElementById('closeCart')?.addEventListener('click', closeAll);

// --- স্লাইডার ইঞ্জিন (পিসি এবং মোবাইলের জন্য আলাদা) ---
function initSlider(sliderId, dotsContainerId, gapValue, autoplayTime) {
    const slider = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsContainerId);
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoplayInterval;

    // ১. ডটস জেনারেশন
    const setupDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const cards = slider.children;
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth + gapValue;
        const visibleCards = Math.round(slider.offsetWidth / cardWidth);
        const totalDots = Math.max(1, cards.length - visibleCards + 1);

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                stopAutoplay();
                slider.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                startAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    };

    // ২. পিসির জন্য ড্র্যাগ লজিক (মাউস ইভেন্ট)
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        stopAutoplay();
    });

    const endDrag = () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('dragging');
        startAutoplay();
    };

    slider.addEventListener('mouseup', endDrag);
    slider.addEventListener('mouseleave', endDrag);

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // পিসিতে ড্র্যাগ করার সময় টেক্সট সিলেক্ট হওয়া বন্ধ
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
    });

    // ৩. মোবাইলের জন্য স্ক্রল ইভেন্ট (ডটস আপডেট করার জন্য)
    slider.addEventListener('scroll', () => {
        if (!dotsContainer) return;
        const cardWidth = slider.children[0].offsetWidth + gapValue;
        const currentIndex = Math.round(slider.scrollLeft / cardWidth);
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    });

    // ৪. অটো-প্লে
    const startAutoplay = () => {
        if (!autoplayTime) return;
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            const cardWidth = slider.children[0].offsetWidth + gapValue;
            const maxScroll = slider.scrollWidth - slider.offsetWidth;
            if (slider.scrollLeft >= maxScroll - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }, autoplayTime);
    };

    const stopAutoplay = () => clearInterval(autoplayInterval);

    // ৫. টাচ ইভেন্টে অটো-প্লে থামানো (মোবাইলের জন্য)
    slider.addEventListener('touchstart', () => stopAutoplay(), { passive: true });
    slider.addEventListener('touchend', () => startAutoplay(), { passive: true });

    // ৬. ইনিশিয়ালাইজ
    setupDots();
    startAutoplay();
    window.addEventListener('resize', setupDots);
}

// সব স্লাইডার চালু করো
window.addEventListener('DOMContentLoaded', () => {
    initSlider('productSlider', 'sliderDots', 20, 4000);
    initSlider('relatedSlider', 'relatedDots', 20, 4000);
    initSlider('brandSlider', null, 24, 3000);
    initSlider('feedbackSlider', 'feedbackDots', 24, 5000);
});

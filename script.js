// --- ১. UI সিলেক্টর সমূহ ---
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const mobileSidebar = document.getElementById('mobileSidebar');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const mobileSearchContainer = document.getElementById('mobileSearchContainer');

// --- ২. নেভিগেশন ও সাইডবার লজিক ---
const closeAll = () => {
    mobileSidebar?.classList.add('-translate-x-full');
    cartSidebar?.classList.add('translate-x-full');
    overlay?.classList.add('hidden');
    mobileSearchContainer?.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    const icon = mobileSearchBtn?.querySelector('i');
    if(icon) icon.classList.replace('fa-xmark', 'fa-magnifying-glass');
};

cartBtn?.addEventListener('click', () => {
    cartSidebar?.classList.remove('translate-x-full');
    overlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

menuBtn?.addEventListener('click', () => {
    mobileSidebar?.classList.remove('-translate-x-full');
    overlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

closeMenu?.addEventListener('click', closeAll);
closeCart?.addEventListener('click', closeAll);
overlay?.addEventListener('click', closeAll);

// মোবাইলে একর্ডিয়ন
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('i');
        content?.classList.toggle('hidden');
        icon?.classList.toggle('rotate-180');
    });
});

// মোবাইল সার্চ টগল
mobileSearchBtn?.addEventListener('click', () => {
    mobileSearchContainer?.classList.toggle('hidden');
    const icon = mobileSearchBtn.querySelector('i');
    icon?.classList.toggle('fa-magnifying-glass');
    icon?.classList.toggle('fa-xmark');
});

// --- ৩. আল্টিমেট স্লাইডার ইঞ্জিন (PC Drag + Mobile Native Swipe) ---
function initSlider(sliderId, dotsContainerId, gapValue, autoplayTime) {
    const slider = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsContainerId);
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoplayInterval;

    // ডটস সেটআপ
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

    // স্ক্রল ইভেন্টে ডটস আপডেট (কাজ করবে মাউস ও টাচ উভয়েই)
    slider.addEventListener('scroll', () => {
        if (!dotsContainer) return;
        const cardWidth = slider.children[0].offsetWidth + gapValue;
        const currentIndex = Math.round(slider.scrollLeft / cardWidth);
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
    });

    // --- পিসির জন্য মাউস ড্র্যাগ লজিক ---
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('dragging'); // স্ন্যাপ বন্ধ করে
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        stopAutoplay();
    });

    const stopDrag = () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('dragging');
        startAutoplay();
    };

    slider.addEventListener('mouseup', stopDrag);
    slider.addEventListener('mouseleave', stopDrag);

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // টেক্সট সিলেকশন বন্ধ করে
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; // ড্র্যাগ স্পিড
        slider.scrollLeft = scrollLeft - walk;
    });

    // --- মোবাইলের জন্য টাচ লজিক (নেটিভ সোয়াইপ) ---
    // মোবাইলে JS ড্র্যাগ বন্ধ, শুধু ব্রাউজারের নেটিভ সোয়াইপ কাজ করবে যা iPhone এ 100% স্মুথ
    slider.addEventListener('touchstart', () => stopAutoplay(), { passive: true });
    slider.addEventListener('touchend', () => startAutoplay(), { passive: true });

    // --- অটো-প্লে ---
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

    // ইনিশিয়ালাইজ
    setupDots();
    startAutoplay();
    window.addEventListener('resize', setupDots);
}

// --- ৪. পেজ লোড হলে সব স্লাইডার চালু করা ---
window.addEventListener('DOMContentLoaded', () => {
    // New Arrival Slider (id, dotsId, gap, autoplay)
    initSlider('productSlider', 'sliderDots', 20, 4000);
    
    // Related Products Slider (যদি থাকে)
    initSlider('relatedSlider', 'relatedDots', 20, 4000);
    
    // Brand Slider
    initSlider('brandSlider', null, 24, 3000);
    
    // Feedback Slider
    initSlider('feedbackSlider', 'feedbackDots', 24, 5000);
});
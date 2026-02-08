


// সিলেক্টর সমূহ
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const mobileSidebar = document.getElementById('mobileSidebar');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const mobileSearchContainer = document.getElementById('mobileSearchContainer');

// কার্ট ওপেন এবং ক্লোজ লজিক
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

menuBtn.addEventListener('click', () => {
    mobileSidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

// সব ক্লোজ করার কমন ফাংশন (let ব্যবহার করা হয়েছে যাতে পরে আপডেট করা যায়)
let closeAll = () => {
    mobileSidebar.classList.add('-translate-x-full');
    cartSidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // সার্চ বার বন্ধ করা
    mobileSearchContainer.classList.add('hidden');
    const searchIcon = mobileSearchBtn.querySelector('i');
    if(searchIcon) searchIcon.classList.replace('fa-xmark', 'fa-magnifying-glass');
};

closeMenu.addEventListener('click', closeAll);
closeCart.addEventListener('click', closeAll);
overlay.addEventListener('click', closeAll);

// মোবাইলে একর্ডিয়ন
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('i');
        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    });
});

// মোবাইল সার্চ টগল
mobileSearchBtn.addEventListener('click', () => {
    mobileSearchContainer.classList.toggle('hidden');
    const icon = mobileSearchBtn.querySelector('i');
    if (mobileSearchContainer.classList.contains('hidden')) {
        icon.classList.replace('fa-xmark', 'fa-magnifying-glass');
    } else {
        icon.classList.replace('fa-magnifying-glass', 'fa-xmark');
    }
});

// ==========================================
// NEW ARRIVAL SLIDER (index.html)
// ==========================================
const mainSlider = document.getElementById('productSlider');
const mainDotsContainer = document.getElementById('sliderDots');
let mainIsDown = false;
let mainStartX;
let mainScrollLeft;
let mainAutoplay;

// --- ড্র্যাগ শুরু (Mouse & Touch) ---
const startMainDrag = (e) => {
    mainIsDown = true;
    mainSlider.classList.add('dragging');
    mainStartX = (e.pageX || e.touches[0].pageX) - mainSlider.offsetLeft;
    mainScrollLeft = mainSlider.scrollLeft;
    stopMainAutoplay();
};

// --- ড্র্যাগ শেষ ---
const endMainDrag = () => {
    if (!mainIsDown) return;
    mainIsDown = false;
    mainSlider.classList.remove('dragging');
    mainSlider.style.scrollSnapType = 'x mandatory';
    startMainAutoplay();
};

// --- ড্র্যাগ চলাকালীন ---
const moveMainDrag = (e) => {
    if (!mainIsDown) return;
    const x = (e.pageX || e.touches[0].pageX) - mainSlider.offsetLeft;
    const walk = (x - mainStartX) * 1.5;
    
    if (Math.abs(walk) > 5) {
        mainSlider.scrollLeft = mainScrollLeft - walk;
    }
};

// ইভেন্ট লিসেনার যুক্ত করা (Mouse)
mainSlider.addEventListener('mousedown', startMainDrag);
mainSlider.addEventListener('mouseup', endMainDrag);
mainSlider.addEventListener('mouseleave', endMainDrag);
mainSlider.addEventListener('mousemove', moveMainDrag);

// ইভেন্ট লিসেনার যুক্ত করা (Touch Support)
mainSlider.addEventListener('touchstart', startMainDrag, { passive: true });
mainSlider.addEventListener('touchend', endMainDrag, { passive: true });
mainSlider.addEventListener('touchmove', moveMainDrag, { passive: true });

// --- ডটস এবং অটো-প্লে লজিক ---
function setupMainSlider() {
    if (!mainSlider || !mainDotsContainer) return;
    mainDotsContainer.innerHTML = '';
    const cards = mainSlider.querySelectorAll('.product-card');
    if (cards.length === 0) return;

    const gap = window.innerWidth < 768 ? 20 : 20; // তোমার গ্যাপ অনুযায়ী
    const cardWidth = cards[0].offsetWidth + gap;
    const visibleCards = Math.round(mainSlider.offsetWidth / cardWidth);
    const totalDots = Math.max(1, cards.length - visibleCards + 1);

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            stopMainAutoplay();
            mainSlider.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            startMainAutoplay();
        });
        mainDotsContainer.appendChild(dot);
    }
}

mainSlider.addEventListener('scroll', () => {
    const cards = mainSlider.querySelectorAll('.product-card');
    const gap = 20;
    const cardWidth = cards[0].offsetWidth + gap;
    const currentIndex = Math.round(mainSlider.scrollLeft / cardWidth);
    const dots = mainDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
});

function startMainAutoplay() {
    stopMainAutoplay();
    mainAutoplay = setInterval(() => {
        const cards = mainSlider.querySelectorAll('.product-card');
        const gap = 20;
        const cardWidth = cards[0].offsetWidth + gap;
        const maxScroll = mainSlider.scrollWidth - mainSlider.offsetWidth;
        if (mainSlider.scrollLeft >= maxScroll - 10) mainSlider.scrollLeft = 0;
        else mainSlider.scrollLeft += cardWidth;
    }, 4000);
}

function stopMainAutoplay() { clearInterval(mainAutoplay); }

// ইনিশিয়ালাইজেশন
window.addEventListener('load', () => {
    setupMainSlider();
    startMainAutoplay();
});
window.addEventListener('resize', setupMainSlider);








const brandSlider = document.getElementById('brandSlider');
let isBrandDown = false;
let brandStartX;
let brandScrollLeft;
let brandAutoplay;

// ব্র্যান্ড ড্র্যাগিং লজিক
brandSlider.addEventListener('mousedown', (e) => {
    isBrandDown = true;
    brandStartX = e.pageX - brandSlider.offsetLeft;
    brandScrollLeft = brandSlider.scrollLeft;
    stopBrandAutoplay();
});

brandSlider.addEventListener('mouseleave', () => {
    isBrandDown = false;
    startBrandAutoplay();
});

brandSlider.addEventListener('mouseup', () => {
    isBrandDown = false;
    startBrandAutoplay();
});

brandSlider.addEventListener('mousemove', (e) => {
    if (!isBrandDown) return;
    e.preventDefault();
    const x = e.pageX - brandSlider.offsetLeft;
    const walk = (x - brandStartX) * 2;
    brandSlider.scrollLeft = brandScrollLeft - walk;
});

// ব্র্যান্ড অটো-প্লে
function startBrandAutoplay() {
    stopBrandAutoplay();
    brandAutoplay = setInterval(() => {
        const itemWidth = brandSlider.querySelector('.brand-item').offsetWidth + 24;
        const maxScroll = brandSlider.scrollWidth - brandSlider.offsetWidth;
        
        if (brandSlider.scrollLeft >= maxScroll - 5) {
            brandSlider.scrollLeft = 0;
        } else {
            brandSlider.scrollLeft += itemWidth;
        }
    }, 3000);
}

function stopBrandAutoplay() {
    clearInterval(brandAutoplay);
}

// ইনিশিয়ালাইজ
window.addEventListener('load', startBrandAutoplay);






//Our Customer Feedback

const fSlider = document.getElementById('feedbackSlider');
const fDotsContainer = document.getElementById('feedbackDots');
let fIsDown = false;
let fStartX;
let fScrollLeft;
let fAutoplay;

function setupFeedbackSlider() {
    if (!fDotsContainer || !fSlider) return;
    fDotsContainer.innerHTML = '';
    const cards = fSlider.querySelectorAll('.feedback-card');
    const cardWidth = cards[0].offsetWidth + 24; // 24 is gap
    const visibleCards = Math.round(fSlider.offsetWidth / cardWidth);
    const totalDots = Math.max(1, cards.length - visibleCards + 1);

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            stopFeedbackAutoplay();
            fSlider.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            startFeedbackAutoplay();
        });
        fDotsContainer.appendChild(dot);
    }
}

fSlider.addEventListener('scroll', () => {
    const cardWidth = fSlider.querySelector('.feedback-card').offsetWidth + 24;
    const currentIndex = Math.round(fSlider.scrollLeft / cardWidth);
    const dots = fDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
});

// Dragging
fSlider.addEventListener('mousedown', (e) => {
    fIsDown = true;
    fSlider.style.scrollSnapType = 'none';
    fStartX = e.pageX - fSlider.offsetLeft;
    fScrollLeft = fSlider.scrollLeft;
    stopFeedbackAutoplay();
});
fSlider.addEventListener('mouseleave', () => { fIsDown = false; startFeedbackAutoplay(); });
fSlider.addEventListener('mouseup', () => { 
    fIsDown = false; 
    fSlider.style.scrollSnapType = 'x mandatory';
    startFeedbackAutoplay(); 
});
fSlider.addEventListener('mousemove', (e) => {
    if (!fIsDown) return;
    e.preventDefault();
    const x = e.pageX - fSlider.offsetLeft;
    const walk = (x - fStartX) * 1.5;
    fSlider.scrollLeft = fScrollLeft - walk;
});

function startFeedbackAutoplay() {
    stopFeedbackAutoplay();
    fAutoplay = setInterval(() => {
        const cardWidth = fSlider.querySelector('.feedback-card').offsetWidth + 24;
        const maxScroll = fSlider.scrollWidth - fSlider.offsetWidth;
        if (fSlider.scrollLeft >= maxScroll - 10) fSlider.scrollLeft = 0;
        else fSlider.scrollLeft += cardWidth;
    }, 5000); // Feedbacks slide every 5 seconds
}

function stopFeedbackAutoplay() { clearInterval(fAutoplay); }

window.addEventListener('load', () => { setupFeedbackSlider(); startFeedbackAutoplay(); });
window.addEventListener('resize', setupFeedbackSlider);
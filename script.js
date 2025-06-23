// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .stat, .about-content, .contact-content');
    animateElements.forEach(el => observer.observe(el));
});

// Projects Carousel
document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (carouselTrack && prevBtn && nextBtn) {
        const cards = carouselTrack.querySelectorAll('.project-card');
        const cardWidth = 280 + 24; // card width + gap (1.5rem = 24px)
        
        // Responsive cards per view
        let cardsPerView = 3; // Desktop: 3 cards
        if (window.innerWidth < 768) {
            cardsPerView = 1; // Mobile: 1 card
        } else if (window.innerWidth < 1024) {
            cardsPerView = 2; // Tablet: 2 cards
        }
        
        let currentIndex = 0;
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        
        // Create dots
        const totalDots = Math.ceil(cards.length / cardsPerView);
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        function updateCarousel() {
            // Account for the padding in the track
            const translateX = -currentIndex * cardWidth;
            carouselTrack.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            // Update dots - calculate which dot should be active
            const dots = dotsContainer.querySelectorAll('.dot');
            const activeDotIndex = Math.floor(currentIndex / cardsPerView);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index * cardsPerView;
            updateCarousel();
        }
        
        function nextSlide() {
            // Move by cardsPerView to go to next dot position
            if (currentIndex < maxIndex) {
                currentIndex = Math.min(currentIndex + cardsPerView, maxIndex);
                updateCarousel();
            }
        }
        
        function prevSlide() {
            // Move by cardsPerView to go to previous dot position
            if (currentIndex > 0) {
                currentIndex = Math.max(currentIndex - cardsPerView, 0);
                updateCarousel();
            }
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carouselTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        });
        
        // Initialize
        updateCarousel();
        
        // Auto-play (optional - uncomment if you want auto-sliding)
        // setInterval(nextSlide, 5000);
    }
});

// Contact form handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Get form data
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const subject = contactForm.querySelector('input[name="subject"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            e.preventDefault();
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Form will submit normally to Formspree
        // After submission, Formspree will redirect back to your site
        // We'll handle the success state in the next page load
    });
}

// Skill items hover effect
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(10px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0) scale(1)';
    });
});

// Project cards click effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1)';
        }, 200);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .project-card {
        cursor: pointer;
    }
    
    .skill-item {
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat h3');
            stats.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
} 
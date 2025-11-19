
class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.observeElements();
        this.initScrollEffects();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToAnimate = document.querySelectorAll('.service-card, .about-content, .contact-form, main section, .hero-content');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    initScrollEffects() {
        this.initParallax();

        this.initStaggeredAnimations();
    }

    initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let ticking = false;
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    initStaggeredAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        serviceCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--color-white)';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            heroTitle.style.borderRight = 'none';
        }
    };

    setTimeout(typeWriter, 1000);
}

function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    initTypingEffect();
    initServiceCardEffects();
});

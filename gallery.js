
class GalleryLightbox {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.createLightbox();
        this.bindEvents();
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay">
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <button class="lightbox-prev">&larr;</button>
                    <img class="lightbox-image" src="" alt="">
                    <button class="lightbox-next">&rarr;</button>
                    <div class="lightbox-caption"></div>
                </div>
            </div>
        `;
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .lightbox-overlay {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                text-align: center;
            }
            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            .lightbox-close, .lightbox-prev, .lightbox-next {
                position: absolute;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 10px 15px;
                border-radius: 50%;
                transition: background 0.3s;
            }
            .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(0, 0, 0, 0.9);
            }
            .lightbox-close {
                top: -50px;
                right: 0;
            }
            .lightbox-prev {
                left: -60px;
                top: 50%;
                transform: translateY(-50%);
            }
            .lightbox-next {
                right: -60px;
                top: 50%;
                transform: translateY(-50%);
            }
            .lightbox-caption {
                position: absolute;
                bottom: -50px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 16px;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 4px;
                max-width: 80%;
            }
            @media (max-width: 768px) {
                .lightbox-prev, .lightbox-next {
                    display: none;
                }
                .lightbox-close {
                    top: 10px;
                    right: 10px;
                }
                .lightbox-caption {
                    bottom: 10px;
                    font-size: 14px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(lightbox);

        this.lightbox = lightbox;
        this.imageElement = lightbox.querySelector('.lightbox-image');
        this.captionElement = lightbox.querySelector('.lightbox-caption');
    }

    bindEvents() {
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox.querySelector('.lightbox-overlay') ||
                e.target.classList.contains('lightbox-close')) {
                this.close();
            }
        });
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());

        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.style.display || this.lightbox.style.display === 'none') return;

            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.services-grid img, .gallery-grid img')) {
                e.preventDefault();
                this.open(e.target);
            }
        });
    }

    open(clickedImage) {
        this.images = Array.from(document.querySelectorAll('.services-grid img, .gallery-grid img'));
        this.currentIndex = this.images.indexOf(clickedImage);

        this.updateImage();
        this.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';

        this.lightbox.offsetHeight;
        this.lightbox.style.opacity = '1';
    }

    close() {
        this.lightbox.style.opacity = '0';
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    updateImage() {
        const currentImage = this.images[this.currentIndex];
        this.imageElement.src = currentImage.src;
        this.captionElement.textContent = currentImage.alt;
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GalleryLightbox();
});

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;

        this.cat = {
            x: 50,
            y: 200,
            width: 48,
            height: 48,
            speedY: 0,
            jumping: false,
            direction: 1, // 1 sağ, -1 sol
            frame: 0,
            frameCount: 0
        };

        this.platforms = [
            { x: 0, y: 350, width: 800, height: 50 },
            { x: 300, y: 250, width: 100, height: 20 },
            { x: 500, y: 150, width: 100, height: 20 }
        ];

        this.score = 0;
        this.lives = 3;

        this.gravity = 0.5;
        this.jumpForce = -12;

        // SVG tanımlamaları
        this.defineSVGs();
        this.bindEvents();
        this.gameLoop();
    }

    defineSVGs() {
        // Kedi SVG'si
        this.catSVG = `
            <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g id="cat">
                    <path d="M24 8 L36 20 L36 40 L12 40 L12 20 Z" fill="#FFA500"/>
                    <circle cx="18" cy="24" r="2" fill="black"/>
                    <circle cx="30" cy="24" r="2" fill="black"/>
                    <path d="M12 20 L8 16 L12 16 Z" fill="#FFA500"/>
                    <path d="M36 20 L40 16 L36 16 Z" fill="#FFA500"/>
                    <path d="M20 28 Q24 32 28 28" fill="none" stroke="black" stroke-width="1"/>
                </g>
            </svg>`;

        // Platform SVG'si
        this.platformSVG = `
            <svg width="32" height="20" viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="20" fill="#4CAF50" rx="4"/>
                <line x1="0" y1="0" x2="32" y2="0" stroke="#45a049" stroke-width="2"/>
                <line x1="0" y1="20" x2="32" y2="20" stroke="#3d8b40" stroke-width="2"/>
            </svg>`;

        // SVG'leri Image nesnelerine dönüştür
        this.svgToImage(this.catSVG, 'cat');
        this.svgToImage(this.platformSVG, 'platform');
    }

    svgToImage(svgString, name) {
        const blob = new Blob([svgString], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        this[name + 'Image'] = new Image();
        this[name + 'Image'].src = url;
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.cat.jumping) {
                this.cat.speedY = this.jumpForce;
                this.cat.jumping = true;
            }
            if (e.code === 'ArrowLeft') {
                this.cat.x -= 5;
                this.cat.direction = -1;
            }
            if (e.code === 'ArrowRight') {
                this.cat.x += 5;
                this.cat.direction = 1;
            }
        });
    }

    update() {
        // Yerçekimi
        this.cat.speedY += this.gravity;
        this.cat.y += this.cat.speedY;

        // Platform çarpışma kontrolü
        this.platforms.forEach(platform => {
            if (this.checkCollision(this.cat, platform)) {
                if (this.cat.speedY > 0) {
                    this.cat.y = platform.y - this.cat.height;
                    this.cat.speedY = 0;
                    this.cat.jumping = false;
                }
            }
        });

        // Ekran sınırları
        if (this.cat.x < 0) this.cat.x = 0;
        if (this.cat.x + this.cat.width > this.canvas.width) {
            this.cat.x = this.canvas.width - this.cat.width;
        }

        // Düşme kontrolü
        if (this.cat.y > this.canvas.height) {
            this.lives--;
            document.getElementById('livesValue').textContent = this.lives;
            if (this.lives <= 0) {
                alert('Oyun Bitti! Skor: ' + this.score);
                location.reload();
            } else {
                this.resetCat();
            }
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }

    resetCat() {
        this.cat.x = 50;
        this.cat.y = 200;
        this.cat.speedY = 0;
        this.cat.jumping = false;
    }

    draw() {
        // Arkaplanı temizle
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Gökyüzü gradyanı
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Platformları çiz
        this.platforms.forEach(platform => {
            for (let x = platform.x; x < platform.x + platform.width; x += 32) {
                this.ctx.drawImage(
                    this.platformImage,
                    x,
                    platform.y,
                    Math.min(32, platform.x + platform.width - x),
                    platform.height
                );
            }
        });
        
        // Kediyi çiz
        this.ctx.save();
        if (this.cat.direction === -1) {
            this.ctx.translate(this.cat.x + this.cat.width, this.cat.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.catImage, 0, 0, this.cat.width, this.cat.height);
        } else {
            this.ctx.drawImage(this.catImage, this.cat.x, this.cat.y, this.cat.width, this.cat.height);
        }
        this.ctx.restore();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Oyunu başlat
window.onload = () => {
    new Game();
}; 
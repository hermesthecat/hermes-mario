class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        this.cat = {
            x: 50,
            y: 200,
            width: 40,
            height: 40,
            speedY: 0,
            jumping: false
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
        
        this.bindEvents();
        this.gameLoop();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.cat.jumping) {
                this.cat.speedY = this.jumpForce;
                this.cat.jumping = true;
            }
            if (e.code === 'ArrowLeft') {
                this.cat.x -= 5;
            }
            if (e.code === 'ArrowRight') {
                this.cat.x += 5;
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
        
        // Kediyi çiz
        this.ctx.fillStyle = '#FFA500';
        this.ctx.fillRect(this.cat.x, this.cat.y, this.cat.width, this.cat.height);
        
        // Platformları çiz
        this.ctx.fillStyle = '#4CAF50';
        this.platforms.forEach(platform => {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
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
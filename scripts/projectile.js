class Projectile {
    constructor(positionX, positionY, width, height, destination, damage, src) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = 200;
        this.width = width;
        this.height = height;
        this.destination = destination;
        this.damage = damage;
        this.image = new Image();
        this.image.src = src;
        this.hit = false;
    }

    draw() {
        context.beginPath();
        context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
    }

    step(modifier, enemies) {
        const velocity = this.speed * modifier;
        this.positionX += (this.destination.x * velocity);
        this.positionY += this.destination.y * velocity;
        this.draw();
        for (let enemy of enemies) {
            let x = Math.abs(enemy.positionX - this.positionX);
            let y = Math.abs(enemy.positionY - this.positionY);
            let radius = enemy.width /2; 
            if(x <= radius) {
                this.hit = true;
                enemy.hp -= this.damage;
            }
        }
    }
}
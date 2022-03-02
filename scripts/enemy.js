class Enemy {
    constructor(name, positionX, positionY, width, height, hp, damage, src) {
        this.name = name;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = 100;
        this.width = width;
        this.height = height;
        this.hp = hp;
        this.damage = damage;
        this.image = new Image();
        this.image.src = src;
    }

    draw() {
        rotate = Math.atan2(hero.positionY - this.positionY, hero.positionX - this.positionX) + Math.PI / 2;

        context.save();

        context.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
        context.rotate(rotate);
        context.translate(-this.positionX + -this.width / 2, -this.positionY + -this.height / 2);
        context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
        context.beginPath();
        context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2, 0, 2 * Math.PI, false);
        context.stroke();
        context.clip();
        context.closePath();

        context.restore();
    }

    step(modifier, hero) {
        const angle = Math.atan2(this.positionY - hero.positionY, this.positionX - hero.positionX);
        const heroPosition = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        if (isEnemyHit(this, hero)) {
            hero.actualHp -= this.damage;
        }
        const velocity = this.speed * modifier;
        this.positionX -= (heroPosition.x * velocity);
        this.positionY -= heroPosition.y * velocity;
        this.draw();
    }
}

function isEnemyHit(enemy, hero) {
    let dx = (enemy.positionX + enemy.width / 2) - (hero.positionX + hero.width / 2);
    let dy = (enemy.positionY + enemy.height / 2) - (hero.positionY + hero.height / 2);
    let rSum = enemy.width / 2 + hero.width / 2;
    return (dx * dx + dy * dy <= rSum * rSum);
}
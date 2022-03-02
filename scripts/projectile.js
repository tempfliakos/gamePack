/** 
 * type: {
 * radius: number
 * damage: number
 * color: string
 * speed: number
 * }
*/

const defaultType = {
    radius: 5,
    damage: 10,
    color: 'black',
    speed: 500
}

class Projectile {
    constructor(positionX, positionY, destination, type = defaultType) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.destination = destination;
        this.type = type;
        this.hit = false;
    }

    draw() {
        context.beginPath();
        context.arc(this.positionX, this.positionY, this.type.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.type.color;
        context.fill();
        context.lineWidth = 0;
        context.strokeStyle = this.type.color;
        context.stroke();
    }

    step(modifier, enemies) {
        for (let enemy of enemies) {
            if (isProjectileHit(this, enemy)) {
                this.hit = true;
                enemy.hp -= this.damage;
            }
        }
        const velocity = this.type.speed * modifier;
        this.positionX += (this.destination.x * velocity);
        this.positionY += this.destination.y * velocity;
        this.draw();
    }
}

function isProjectileHit(projectile, enemy) {
    let dx = enemy.positionX - projectile.positionX;
    let dy = enemy.positionY - projectile.positionY;
    let rSum = projectile.width + enemy.width;
    return (dx * dx + dy * dy <= rSum * rSum);
}
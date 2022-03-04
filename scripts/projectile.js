class Projectile {
    constructor(positionX, positionY, destination, type = hero.weapon) {
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
				enemy.hp -= this.type.damage;
				if (enemy.hp <= 0) {
					deadEnemies++;
					hero.gainExp(enemy.reward);
				}
            }
        }
        const velocity = this.type.velocity * modifier;
        this.positionX += (this.destination.x * velocity);
        this.positionY += this.destination.y * velocity;
        this.draw();
    }
}

function isProjectileHit(projectile, enemy) {
	let dx = (enemy.positionX + enemy.width / 2) - projectile.positionX;
	let dy = (enemy.positionY + enemy.height / 2) - projectile.positionY;
	let rSum = projectile.type.radius + enemy.width / 2;
	return (dx * dx + dy * dy <= rSum * rSum);
}
class Projectile {
	constructor(positionX, positionY, destination, type = hero.weapon, projDirection) {
		this.positionX = positionX;
		this.positionY = positionY;
		this.destination = destination;
		this.type = type;
		this.hit = false;
		this.startPositionX = positionX;
		this.startPositionY = positionY;
		this.direction = projDirection;
	}

	draw() {
		context.beginPath();
		context.save();
		context.translate(this.positionX, this.positionY);
		console.log(this.direction);
		context.rotate(this.direction);
		context.translate(-this.positionX, -this.positionY);
		if (hero.weapon.width > 0) {

			// the triangle
			context.moveTo(this.positionX, this.positionY - this.type.height / 2);
			context.lineTo(this.positionX, this.positionY - this.type.height / 2 + this.type.height);
			context.lineTo(this.positionX + this.type.width, this.positionY);
			context.closePath();

			// the outline
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();

			// the fill color
			context.fillStyle = this.type.color;
			context.fill();
		} else {
			context.arc(this.positionX, this.positionY, this.type.radius, 0, 2 * Math.PI, false);
			context.fillStyle = this.type.color;
			context.fill();
			context.lineWidth = 0;
			context.strokeStyle = this.type.color;
			context.stroke();
		}
		context.restore();
	}

	step(modifier, enemies) {
		for (let enemy of enemies) {
			if (isProjectileHit(this, enemy)) {
				this.hit = true;
				enemy.hp -= this.type.damage + hero.damage;
				if (enemy.hp <= 0) {
					deadEnemies++;
					hero.gainExp(enemy.reward);
					drawExplosion(enemy.positionX, enemy.positionY, enemy.width)
				}
				//blood
				enemyHits.push({
					damage: this.type.damage,
					enemyProt: enemy,
					x: randomInterval(enemy.positionX - 5, enemy.positionX + 5),
					y: randomInterval(enemy.positionY - 5, enemy.positionY + 5),
					rad: (1 - (enemy.hp / enemy.maxHp)) * randomInterval((enemy.width / 4) - 5, (enemy.width / 4) + 5),
					bloodColor: '#ff0000' + Math.round((1 - (enemy.hp / enemy.maxHp)) * 9) + Math.round((1 - (enemy.hp / enemy.maxHp)) * 9),
					timeout: addSeconds(5)
				});
			}
		}
		const velocity = this.type.velocity * modifier;
		this.positionX += this.destination.x * velocity;
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
class Enemy {
	constructor(positionX, positionY, type) {
		this.positionX = positionX;
		this.positionY = positionY;

		let enemyType = enemyTypes[type];

		this.maxHp = enemyType.hp;
		this.hp = enemyType.hp;
		this.damage = enemyType.damage;
		this.velocity = enemyType.velocity;
		this.image = new Image();
		this.image.src = enemyType.appearence;
		this.width = enemyType.size;
		this.height = enemyType.size;
		this.reward = enemyType.reward;
		this.damageInterval = enemyType.damageInterval;

		this.lastDamage = undefined;
	}

	draw() {
		rotate = Math.atan2(hero.positionY - this.positionY, hero.positionX - this.positionX) + Math.PI / 2;

		//shadow
		context.beginPath();
		context.fillStyle = "#00000044";
		context.filter = 'blur(4px)';
		context.arc(this.positionX, this.positionY, this.width / 2, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
		context.filter = 'none';

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

		let bad = "rgba(168, 55, 55, 0.9)";
		let normal = "rgba(211, 224, 46, 0.9)";
		let good = "rgba(101, 165, 90, 0.9)";
		let hpPercentage = (this.hp / this.maxHp) * 100;
		context.beginPath();
		context.lineWidth = 5;
		context.strokeStyle = (hpPercentage >= 66) ? good : (33 <= hpPercentage && hpPercentage <= 66) ? normal : (hpPercentage <= 33) ? bad : "#000000";
		let hpLine = this.hp / this.maxHp * 2;
		context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2 + 5, 0, hpLine * Math.PI, false);
		context.stroke();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
	}

	step(modifier, hero, enemies) {
		const angle = Math.atan2(this.positionY - hero.positionY, this.positionX - hero.positionX);
		const heroPosition = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		}
		if (isEnemyHit(this, hero)) {
			if (!this.lastDamage || (new Date() - this.lastDamage) > this.damageInterval) {
				hero.actualHp -= this.damage;
				this.lastDamage = new Date();
				if (hero.actualHp <= 0) {
					gameOver = true;
				}
			}
		} else {
			let enemyPosition;
			for (let enemy of enemies) {
				if (this !== enemy && isEnemyHit(this, enemy)) {
					enemyPosition = {
						positionX: enemy.positionX,
						positionY: enemy.positionY,
					}
				}
			}
			const velocity = this.velocity * modifier;
			if (!enemyPosition) {
				this.positionX -= heroPosition.x * velocity;
				this.positionY -= heroPosition.y * velocity;
			} else {
				if (this.positionX > enemyPosition.positionX) {
					this.positionX += 1 * velocity;
				} else if (this.positionX < enemyPosition.positionX) {
					this.positionX -= 1 * velocity;
				}

				if (this.positionY > enemyPosition.positionY) {
					this.positionY += 1 * velocity;
				} else if (this.positionY < enemyPosition.positionY) {
					this.positionY -= 1 * velocity;
				}
			}
		}
		this.draw();
	}
}

function isEnemyHit(enemy, hero) {
	let dx = (enemy.positionX + enemy.width / 2) - (hero.positionX + hero.width / 2);
	let dy = (enemy.positionY + enemy.height / 2) - (hero.positionY + hero.height / 2);
	let rSum = enemy.width / 2 + hero.width / 2;
	return (dx * dx + dy * dy <= rSum * rSum);
}
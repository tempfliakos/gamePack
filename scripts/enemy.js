class Enemy {
	constructor(name, positionX, positionY, width, height, hp, damage, src) {
		this.name = name;
		this.positionX = positionX;
		this.positionY = positionY;
		this.speed = 100;
		this.width = width;
		this.height = height;
		this.maxHp = 10;
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

		let bad = "rgba(168, 55, 55, 0.75)";
		let normal = "rgba(211, 224, 46, 0.75)";
		let good = "rgba(101, 165, 90, 0.75)";
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
			hero.actualHp -= this.damage;
			if (hero.actualHp <= 0) {
				gameOver = true;
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
			const velocity = this.speed * modifier;
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
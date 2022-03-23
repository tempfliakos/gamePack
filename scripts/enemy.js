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
		this.weapon = enemyType.weapon;

		this.lastDamage = undefined;
		this.lastShootTime = new Date();
	}

	draw() {
		rotate = Math.atan2(hero.positionY - this.positionY, hero.positionX - this.positionX) + Math.PI / 2;
		let bad = "rgba(168, 55, 55, 1)";
		let normal = "rgba(211, 224, 46, 1)";
		let good = "rgba(101, 165, 90, 1)";
		let hpPercentage = (this.hp / this.maxHp) * 100;

		context.save();

		context.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
		context.rotate(rotate);
		context.translate(-this.positionX + -this.width / 2, -this.positionY + -this.height / 2);
		context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);

		//hpLine
		context.beginPath();
		context.lineWidth = 5;
		context.strokeStyle = (hpPercentage >= 66) ? good : (33 <= hpPercentage && hpPercentage <= 66) ? normal : (hpPercentage <= 33) ? bad : "#000000";
		let hpLine = this.hp / this.maxHp * 2;
		context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2 + 5, 0, hpLine * Math.PI, false);
		context.stroke();
		context.lineWidth = 1;
		context.strokeStyle = 'black';

		context.beginPath();
		context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2, 0, 2 * Math.PI, false);
		context.stroke();
		context.clip();
		context.closePath();

		context.restore();
		context.strokeStyle = null;
	}

	step(modifier, hero, enemies) {
		if (isGameStarted) {
			const angle = Math.atan2(this.positionY - hero.positionY, this.positionX - hero.positionX);
			const heroPosition = {
				x: Math.cos(angle),
				y: Math.sin(angle)
			}
			if (isEnemyHit(this, hero)) {
				if (!this.lastDamage || (new Date() - this.lastDamage) > this.damageInterval) {
					playSound(stabSound);
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
			this.shoot();
		}
	}

	shoot() {
		if (this.weapon !== undefined) {
			let distance = Math.sqrt(Math.pow(hero.positionX - this.positionX, 2) + Math.pow(hero.positionY - this.positionY, 2));
			if (this.weapon.shootRange > distance) {
				const enAngle = Math.atan2(hero.positionY - this.positionY, hero.positionX - this.positionX);
				const enShootDestination = {
					x: Math.cos(enAngle),
					y: Math.sin(enAngle)
				}
				if (this.weapon.coolDown < (new Date() - this.lastShootTime)) {
					projectiles.push(new Projectile(this.positionX + this.width / 2, this.positionY + this.height / 2, enShootDestination, this.weapon, Math.atan2(mouse.y - this.positionY, mouse.x - this.positionX), 'hero'));
					playSound(this.weapon.sound);
					this.lastShootTime = new Date();
				}
			}
		}
	}
}

function isEnemyHit(enemy, hero) {
	let dx = (enemy.positionX + enemy.width / 2) - (hero.positionX + hero.width / 2);
	let dy = (enemy.positionY + enemy.height / 2) - (hero.positionY + hero.height / 2);
	let rSum = enemy.width / 2 + hero.width / 2;
	return (dx * dx + dy * dy <= rSum * rSum);
}
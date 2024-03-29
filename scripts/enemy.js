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
		this.hitFilter = false;

		this.lastDamage = undefined;
		this.lastShootTime = new Date();
		this.barrier = undefined;
	}

	draw() {
		rotate = Math.atan2(hero.positionY - this.positionY, hero.positionX - this.positionX);
		let bad = "rgba(168, 55, 55, 1)";
		let normal = "rgba(211, 224, 46, 1)";
		let good = "rgba(101, 165, 90, 1)";
		let hpPercentage = (this.hp / this.maxHp) * 100;

		context.save();

		context.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
		context.rotate(rotate);
		context.translate(-this.positionX + -this.width / 2, -this.positionY + -this.height / 2);
		if (this.hitFilter) {
			context.filter = 'opacity(0)';
			context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
			context.filter = 'opacity(1)';
			this.hitFilter = false;
		} else {
			context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
		}


		//hpLine
		context.beginPath();
		context.lineWidth = 5;
		context.strokeStyle = (hpPercentage >= 66) ? good : (33 <= hpPercentage && hpPercentage <= 66) ? normal : (hpPercentage <= 33) ? bad : "#000000";
		let hpLine = this.hp / this.maxHp * 2;
		context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2 + 5, 0, hpLine * Math.PI, false);
		context.stroke();
		context.lineWidth = 1;
		context.strokeStyle = 'black';

		if (this.weapon) {
			//weapon
			context.beginPath();
			context.moveTo(this.positionX + this.width, this.positionY + this.width / 2 - 5);
			context.lineTo(this.positionX + this.width, this.positionY + this.width / 2 + 5);
			context.lineTo(this.positionX + this.width + this.weapon.weaponSize, this.positionY + this.width / 2 + 2);
			context.lineTo(this.positionX + this.width + this.weapon.weaponSize, this.positionY + this.width / 2 - 2);
			context.fillStyle = this.weapon.weaponColor;
			context.fill();
			context.closePath();
		}

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
					hero.hitFilter = true;
					playSound(stabSound);
					hero.actualHp -= this.damage;
					this.lastDamage = new Date();
					if (hero.actualHp <= 0) {
						gameOver = true;
					}
				}
			} else {
				let enemyPosition;
				this.barrier = undefined;
				let noStep = false;
				for (let enemy of enemies) {
					if ((this !== enemy && isEnemyHit(this, enemy))) {
						noStep = true;
						enemyPosition = {
							positionX: enemy.positionX,
							positionY: enemy.positionY,
						}
					}
				}
				for (let barrier of barriers) {
					if (isBarrierHitByEnemy(barrier, this)) {
						this.barrier = barrier;
						noStep = true;
					}
				}
				const velocity = this.velocity * modifier;
				if (!noStep) {
					let distance = Math.sqrt(Math.pow(hero.positionX - this.positionX, 2) + Math.pow(hero.positionY - this.positionY, 2));
					if (!this.weapon || distance >= this.weapon.upgrades.shootRange) {
						this.positionX -= heroPosition.x * velocity;
						this.positionY -= heroPosition.y * velocity;
					}
				} else {
					if (this.barrier) {
						let x = this.positionX;
						let y = this.positionY;
						let tempEnemy;

						if(this.barrier.positionX / 2 > this.positionX) {
							x += velocity;
						} else if(this.barrier.positionX / 2 <= this.positionX) {
							x -= velocity;
						}

						tempEnemy = {
							positionX: x,
							positionY: y,
							width: this.width
						}

						if(!isBarrierHitByEnemy(this.barrier, tempEnemy)) {
							this.positionX = x;
						}


						if(this.barrier.positionY / 2 > this.positionY) {
							y += velocity;
						} else if(this.barrier.positionY / 2 <= this.positionY) {
							y -= velocity;
						}

						tempEnemy = {
							positionX: x,
							positionY: y,
							width: this.width
						}

						if(!isBarrierHitByEnemy(this.barrier, tempEnemy)) {
							this.positionY = y;
						}

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
			}
			this.draw();
			this.shoot();
		}
	}

	shoot() {
		if (this.weapon !== undefined) {
			let weaponX = (this.positionX + this.width / 2) + (this.width / 2 + this.weapon.weaponSize) * Math.cos(rotate);
			let weaponY = (this.positionY + this.height / 2) + (this.height / 2 + this.weapon.weaponSize) * Math.sin(rotate);
			let distance = Math.sqrt(Math.pow(hero.positionX - this.positionX, 2) + Math.pow(hero.positionY - this.positionY, 2));
			if (this.weapon.upgrades.shootRange > distance) {
				const enAngle = Math.atan2(hero.positionY - this.positionY, hero.positionX - this.positionX);
				const enShootDestination = {
					x: Math.cos(enAngle),
					y: Math.sin(enAngle)
				}
				if (this.weapon.coolDown < (new Date() - this.lastShootTime)) {
					projectiles.push(new Projectile(weaponX, weaponY, enShootDestination, this.weapon, Math.atan2(mouse.y - this.positionY, mouse.x - this.positionX), 'hero'));
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

function isBarrierHitByEnemy(barrier, enemy) {
	return barrier.positionX < enemy.positionX + enemy.width &&
		barrier.positionX + barrier.width > enemy.positionX &&
		barrier.positionY < enemy.positionY + hero.height &&
		barrier.height + barrier.positionY > enemy.positionY
}
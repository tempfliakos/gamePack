let keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.code] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.code];
}, false);

const mouse = {
	x: undefined,
	y: undefined
}
addEventListener("mousemove", e => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

class Hero {
	constructor(positionX, positionY, name = defaultHero.name, width = defaultHero.size, height = defaultHero.size, actualHp = defaultHero.hp, upgrades = defaultHero.upgrades, appearence = defaultHero.appearence, level = defaultHero.level, weapon = defaultHero.weapon, xp = defaultHero.xp, attributePoints = defaultHero.attributePoints, ownedWeapons = defaultHero.ownedWeapons) {
		this.positionX = positionX;
		this.positionY = positionY;
		this.width = width;
		this.height = height;

		this.upgrades = upgrades;
		this.name = name;
		this.actualHp = actualHp;
		this.maxHp = actualHp + this.upgrades.hp;
		this.velocity = defaultHero.velocity + this.upgrades.velocity;
		this.image = new Image();
		this.image.src = appearence;
		this.level = level;
		this.weapon = weapon;
		this.xp = xp;
		this.attributePoints = attributePoints;
		this.damage = this.upgrades.damage;
		this.ownedWeapons = ownedWeapons;
		this.hitFilter = false;
	}

	draw() {
		rotate = Math.atan2(mouse.y - this.positionY, mouse.x - this.positionX);
		let bad = "rgba(168, 55, 55, 1)";
		let normal = "rgba(211, 224, 46, 1)";
		let good = "rgba(101, 165, 90, 1)";
		let hpPercentage = (this.actualHp / this.maxHp) * 100;

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
		let hpLine = this.actualHp / this.maxHp * 2;
		context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2 + 5, 0, hpLine * Math.PI, false);
		context.stroke();
		context.lineWidth = 1;
		context.strokeStyle = 'black';

		//weapon
		context.beginPath();
		context.moveTo(this.positionX + this.width, this.positionY + this.width / 2 - 5);
		context.lineTo(this.positionX + this.width, this.positionY + this.width / 2 + 5);
		context.lineTo(this.positionX + this.width + this.weapon.weaponSize, this.positionY + this.width / 2 + 2);
		context.lineTo(this.positionX + this.width + this.weapon.weaponSize, this.positionY + this.width / 2 - 2);
		context.fillStyle = this.weapon.weaponColor;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2, 0, 2 * Math.PI, false);
		context.stroke();
		context.clip();
		context.closePath();

		context.restore();
		context.strokeStyle = null;
		this.hitFilter = false;
	}

	step(modifier, enemies) {
		const velocity = this.velocity * modifier;
		let x = this.positionX;
		let y = this.positionY;
		let notarget = false;
		if ('KeyW' in keysDown) {
			y -= velocity;
		}
		if ('KeyA' in keysDown) {
			x -= velocity;
		}
		if ('KeyS' in keysDown) {
			y += velocity;
		}
		if ('KeyD' in keysDown) {
			x += velocity;
		}
		if ('Space' in keysDown) {
			notarget = true;
		}

		if (y < 0) {
			y = 0;
		}
		if (x < 0) {
			x = 0;
		}
		if (y + this.height > canvas.height) {
			y = canvas.height - this.height;
		}
		if (x + this.width > canvas.width) {
			x = canvas.width - this.width;
		}

		let enemyMet = false;
		let heroTemp = {
			positionX: x,
			positionY: y,
			width: this.width,
			height: this.height
		}
		if (!notarget) {
			for (let enemy of enemies) {
				if (this !== enemy && isEnemyHit(enemy, heroTemp)) {
					enemyMet = true;
				}
			}
		}
		if (!enemyMet) {
			this.positionX = x;
			this.positionY = y;
		}
	}

	gainExp(numberOfExp) {
		this.xp += numberOfExp;
		let heroLevel = heroLevels[hero.level - 1];
		if (heroLevel && this.xp >= heroLevel.required) {
			hero.level += 1;
			hero.attributePoints += heroLevel.reward;
			showInfoLabel('Hero level: ' + hero.level + '\n Hero attribute points: ' + hero.attributePoints);
			numberOfExp = this.xp - heroLevel.required;
			this.xp = 0;
			this.gainExp(numberOfExp);
		}
	}

	upgrade(type) {
		hero.attributePoints--;
		this.upgrades[type]++;

		this.maxHp = defaultHero.hp + this.upgrades.hp * defaultHero.steps.hp;
		this.velocity = defaultHero.velocity + this.upgrades.velocity * defaultHero.steps.velocity;
		this.damage = this.upgrades.damage * defaultHero.steps.damage;
	}
}

function isEnemyHit(enemy, hero) {
	let dx = (enemy.positionX + enemy.width / 2) - (hero.positionX + hero.width / 2);
	let dy = (enemy.positionY + enemy.height / 2) - (hero.positionY + hero.height / 2);
	let rSum = enemy.width / 2 + hero.width / 4;
	return (dx * dx + dy * dy <= rSum * rSum);
}
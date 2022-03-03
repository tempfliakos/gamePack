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
	constructor(name, positionX, positionY, width, height, actualHp, maxHp) {
		this.name = name;
		this.positionX = positionX;
		this.positionY = positionY;
		this.speed = 100;
		this.width = width;
		this.height = height;
		this.image = new Image();
		this.image.src = "../resources/hero.svg";
		this.actualHp = actualHp;
		this.maxHp = maxHp;
		this.level = 1;
		this.weapon = "Sling-shot";
	}

	draw() {
		rotate = Math.atan2(mouse.y - this.positionY, mouse.x - this.positionX) + Math.PI / 2;

		context.save();

		context.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
		context.rotate(rotate);
		context.translate(-this.positionX + -this.width / 2, -this.positionY + -this.height / 2);
		context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);

		//weapon
		context.beginPath();
		context.moveTo(this.positionX + this.width / 2, this.positionY);
		context.lineTo(this.positionX + this.width / 2, this.positionY - 15);
		context.lineWidth = 10;
		context.stroke();
		context.lineWidth = 1;
		context.closePath();

		context.beginPath();
		context.arc(this.positionX + this.width / 2, this.positionY + this.height / 2, this.width / 2, 0, 2 * Math.PI, false);
		context.stroke();
		context.clip();
		context.closePath();

		context.restore();
	}

	step(modifier, enemies) {
		const velocity = this.speed * modifier;
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
}

function isEnemyHit(enemy, hero) {
	let dx = (enemy.positionX + enemy.width / 2) - (hero.positionX + hero.width / 2);
	let dy = (enemy.positionY + enemy.height / 2) - (hero.positionY + hero.height / 2);
	let rSum = enemy.width / 2 + hero.width / 4;
	return (dx * dx + dy * dy <= rSum * rSum);
}
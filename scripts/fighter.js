"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function initCanvasSize() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	$('body').height(document.documentElement.clientHeight);
}

const mouse = {
	x: undefined,
	y: undefined
}
canvas.addEventListener("mousemove", e => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

canvas.addEventListener("click", e => {
	console.log(mouse);
});

function extractFromBigger(a, b) {
	if (a > b) {
		return a - b;
	} else {
		return b - a;
	}
}

let keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.code] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.code];
}, false);

addEventListener('resize', initCanvasSize);

class Hero {
	constructor(name, positionX, positionY, heroWidth, heroHeight, player) {
		this.name = name;
		this.positionX = positionX;
		this.positionY = positionY;
		this.speed = 300;
		this.width = heroWidth;
		this.height = heroHeight;
		this.image = new Image();
		this.image.src = "../resources/hero.svg";
		this.player = player;
	}

	draw() {
		rotate = Math.atan2(mouse.y - this.positionY, mouse.x - this.positionX) + Math.PI / 2;
		context.beginPath();
		context.save();
		context.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
		context.rotate(rotate);
		context.translate(-this.positionX + -this.width / 2, -this.positionY + -this.height / 2);
		context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
		context.restore();
	}

	step(modifier) {
		const velocity = this.speed * modifier;
		if (this.player === 1) {
			if ('KeyW' in keysDown) {
				this.positionY -= velocity;
			}
			if ('KeyA' in keysDown) {
				this.positionX -= velocity;
			}
			if ('KeyS' in keysDown) {
				this.positionY += velocity;
			}
			if ('KeyD' in keysDown) {
				this.positionX += velocity;
			}
		} else if (this.player === 2) {

			if ('ArrowUp' in keysDown) {
				this.positionY -= velocity;
			}
			if ('ArrowLeft' in keysDown) {
				this.positionX -= velocity;
			}
			if ('ArrowDown' in keysDown) {
				this.positionY += velocity;
			}
			if ('ArrowRight' in keysDown) {
				this.positionX += velocity;
			}
		}

		if (this.positionY < 0) {
			this.positionY = 0;
		}
		if (this.positionX < 0) {
			this.positionX = 0;
		}
		if (this.positionY + this.height > canvas.height) {
			this.positionY = canvas.height - this.height;
		}
		if (this.positionX + this.width > canvas.width) {
			this.positionX = canvas.width - this.width;
		}
	}

	shoot() {

	}
}

initCanvasSize();
let hero = new Hero('Unkindled', (canvas.width / 2) - 20, (canvas.height / 2) - 20, 40, 40, 1);
let then = Date.now();
let rotate;

function drawObjects() {
	hero.draw();
}

const main = function () {
	context.clearRect(0, 0, innerWidth, innerHeight);
	const now = Date.now();
	const delta = now - then;
	hero.step(delta / 1000);
	then = now;
	drawObjects();
	requestAnimationFrame(main);
}

main();
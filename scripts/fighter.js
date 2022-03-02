"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function initCanvasSize() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	$('body').height(document.documentElement.clientHeight);
}

function generateProjectile() {
	const angle = Math.atan2(mouse.y - hero.positionY, mouse.x - hero.positionX);
	const shootDestination = {
		x: Math.cos(angle),
		y: Math.sin(angle)
	}
	projectiles.push(new Projectile(hero.positionX + hero.width / 2, hero.positionY + hero.height / 2, shootDestination));
}

canvas.onmousedown = function (e) {
	generateProjectile(e)
}
let interval;

canvas.addEventListener("mousedown", e => {
	interval = setInterval(generateProjectile, 100);
});

canvas.addEventListener("mouseup", e => {
	clearInterval(interval);
});

addEventListener('resize', initCanvasSize);

initCanvasSize();

class Enemy {
	constructor(name, positionX, positionY, width, height, hp, damage, src) {
		this.name = name;
		this.positionX = positionX;
		this.positionY = positionY;
		this.speed = 50;
		this.width = width;
		this.height = height;
		this.hp = hp;
		this.damage = damage;
		this.image = new Image();
		this.image.src = src;
	}

	draw() {
		rotate = Math.atan2(hero.positionY - this.positionY, hero.positionX - this.positionX) + Math.PI / 2;
		context.beginPath();
		context.save();
		context.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
		context.rotate(rotate);
		context.translate(-this.positionX + -this.width / 2, -this.positionY + -this.height / 2);
		context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);

		context.restore();
	}

	step(modifier) {
		const angle = Math.atan2(this.positionY - hero.positionY, this.positionX - hero.positionX);
		const heroPosition = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		}
		const velocity = this.speed * modifier;
		//this.positionX -= (heroPosition.x * velocity);
		//this.positionY -= heroPosition.y * velocity;
		this.draw();
	}
}

let hero = new Hero('Unkindled', (canvas.width / 2) - 20, (canvas.height / 2) - 20, 40, 40, 80, 100);
let then = Date.now();
let rotate;

let projectiles = [];
let enemies = [];
let maxEnemies = 1;

function drawHud() {
	context.beginPath();
	context.rect(canvas.width - 210, canvas.height - 50, 200, 30);
	context.stroke();
	let hpLine = (((hero.actualHp / hero.maxHp) * 100) / 100) * 200;
	context.fillStyle = "rgba(101, 165, 90, 0.75)";
	context.fillRect(canvas.width - 210, canvas.height - 50, hpLine, 30);
	context.font = "bold 15pt Arial";
	context.fillStyle = "#000000";
	context.fillText("Hero", canvas.width - 130, canvas.height - 30);
}

function drawObjects(delta) {
	drawMap(canvas, context);
	drawHud();
	hero.draw();
	for (let projectile of projectiles) {
		projectile.step(delta / 1000, enemies);
	}

	for (let enemy of enemies) {
		enemy.step(delta / 1000);
	}
}

function generateEnemies() {
	if (enemies.length === 0) {
		for (let i = 0; i < maxEnemies; i++) {
			let sideRandom = Math.random();
			let enemy;
			if (sideRandom > 0 && sideRandom <= 0.25) {
				enemy = new Enemy('Unkindled', randomInterval(0, canvas.width), 0, 40, 40, 10, 10, "../resources/enemy.svg");
			} else if (sideRandom > 0.25 && sideRandom <= 0.5) {
				enemy = new Enemy('Unkindled', canvas.width, randomInterval(0, canvas.height), 40, 40, 10, 10, "../resources/enemy.svg");
			} else if (sideRandom > 0.5 && sideRandom <= 0.75) {
				enemy = new Enemy('Unkindled', randomInterval(0, canvas.width), canvas.height, 40, 40, 10, 10, "../resources/enemy.svg");
			} else if (sideRandom > 0.75 && sideRandom <= 1) {
				enemy = new Enemy('Unkindled', 0, randomInterval(0, canvas.height), 40, 40, 10, 10, "../resources/enemy.svg");
			}
			enemies.push(enemy);
		}
	}
}

function randomInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const main = function () {
	context.clearRect(0, 0, innerWidth, innerHeight);
	const now = Date.now();
	const delta = now - then;
	hero.step(delta / 1000);
	then = now;
	projectiles = projectiles.filter(p => p.hit !== true && p.positionX > 0 && p.positionX < canvas.width && p.positionY > 0 && p.positionY < canvas.height);
	enemies = enemies.filter(e => e.hp > 0);
	drawObjects(delta);
	generateEnemies();
	requestAnimationFrame(main);
}

main();
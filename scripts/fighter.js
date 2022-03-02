"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function initCanvasSize() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	$('body').height(document.documentElement.clientHeight);
}

canvas.addEventListener("click", e => {
	const angle = Math.atan2(e.clientY - hero.positionY, e.clientX - hero.positionX);
	const shootDestination = {
		x: Math.cos(angle),
		y: Math.sin(angle)
	}
	projectiles.push(new Projectile(hero.positionX, hero.positionY, hero.width / 4, hero.height / 4, shootDestination, 10, "../resources/bullet_default.svg"));
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
		context.beginPath();
		context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
	}

	step(modifier) {
		const angle = Math.atan2(this.positionY - hero.positionY, this.positionX - hero.positionX);
		const heroPosition = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		}
		const velocity = this.speed * modifier;
		this.positionX -= (heroPosition.x * velocity);
		this.positionY -= heroPosition.y * velocity;
		this.draw();
	}
}

let hero = new Hero('Unkindled', (canvas.width / 2) - 20, (canvas.height / 2) - 20, 40, 40);
let enemy = new Enemy('Unkindled', (canvas.width / 2) - 100, (canvas.height / 2) - 100, 40, 40, 10, 10, "../resources/enemy.svg");
let then = Date.now();
let rotate;

let projectiles = [];
let enemies = [enemy];

function drawObjects(delta) {
	hero.draw();
	for (let projectile of projectiles) {
		projectile.step(delta / 1000, enemies);
	}

	for (let enemy of enemies) {
		enemy.step(delta / 1000);
	}
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
	requestAnimationFrame(main);
}

main();
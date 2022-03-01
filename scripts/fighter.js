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
let hero = new Hero('Unkindled', (canvas.width / 2) - 20, (canvas.height / 2) - 20, 40, 40);
let then = Date.now();
let rotate;

let projectiles = [];

function drawObjects(delta) {
	hero.draw();
	for (let projectile of projectiles) {
		projectile.step(delta / 1000);
	}
}

const main = function () {
	context.clearRect(0, 0, innerWidth, innerHeight);
	const now = Date.now();
	const delta = now - then;
	hero.step(delta / 1000);
	then = now;
	projectiles = projectiles.filter(p => p.positionX > 0 && p.positionX < canvas.width && p.positionY > 0 && p.positionY < canvas.height);
	drawObjects(delta);
	requestAnimationFrame(main);
}

main();
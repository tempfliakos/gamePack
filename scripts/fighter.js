"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function initCanvasSize() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	$('body').height(document.documentElement.clientHeight);
}

const mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", e => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
	rotate();
});

var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var step = function (modifier) {
	if (87 in keysDown) {
		hero.positionY -= hero.speed * modifier;
	} else if (65 in keysDown) {
		hero.positionX -= hero.speed * modifier;
	} else if (83 in keysDown) {
		hero.positionY += hero.speed * modifier;
	} else if (68 in keysDown) {
		hero.positionX += hero.speed * modifier;
	}
}

class Hero {
	constructor(name, positionX, positionY, heroWidth, heroHeight) {
		this.name = name;
		this.positionX = positionX;
		this.positionY = positionY;
		this.speed = 300;
		this.width = heroWidth;
		this.height = heroHeight;
		this.image = new Image();
		this.image.src = "../resources/hero.svg";
	}
}

function rotate() {
	context.save();
	context.translate(hero.positionX + hero.width / 2, hero.positionY + hero.height / 2);
	context.rotate(Math.atan2(mouse.x - hero.positionX, -(mouse.y - hero.positionY)));
	context.translate(-(hero.positionX + hero.width / 2), -(hero.positionY + hero.height / 2));
	drawHero();
}

function drawHero() {
	context.clearRect(0, 0, innerWidth, innerHeight);
	context.beginPath();
	context.drawImage(hero.image, hero.positionX, hero.positionY, hero.width, hero.height);
}

var main = function () {
	var now = Date.now();
	var delta = now - then;
	step(delta / 1000);
	drawHero();
	then = now;
	requestAnimationFrame(main);
}

initCanvasSize();
window.addEventListener('resize', initCanvasSize);
let hero = new Hero('Unkindled', (canvas.width / 2) - 20, (canvas.height / 2) - 20, 40, 40);
var then = Date.now();
main();
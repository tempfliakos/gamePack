"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function initCanvasSize() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	$('body').height(document.documentElement.clientHeight);
}

var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var heroImage = new Image();
heroImage.src = "../resources/hero.svg";
class Hero {
	constructor(name, positionX, positionY) {
		context.clearRect(0, 0, innerWidth, innerHeight);
		this.name = name;
		this.positionX = positionX;
		this.positionY = positionY;
		this.speed = 300;
		context.beginPath();
		context.drawImage(heroImage, positionX, positionY, 40, 40);
	}
}

var main = function () {
	var now = Date.now();
	var delta = now - then;
	step(delta / 1000);
	hero = new Hero(hero.name, hero.positionX, hero.positionY, false);
	then = now;
	requestAnimationFrame(main);
}

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

initCanvasSize();
window.addEventListener('resize', initCanvasSize);
let hero = new Hero('Unkindled', (canvas.width / 2) - 20, (canvas.height / 2) - 20);
var then = Date.now();
main();
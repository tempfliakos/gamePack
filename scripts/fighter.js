"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function initCanvasSize() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	$('body').height(document.documentElement.clientHeight);
}

let shots = 0;
function generateProjectile() {
	const angle = Math.atan2(mouse.y - hero.positionY, mouse.x - hero.positionX);
	const shootDestination = {
		x: Math.cos(angle),
		y: Math.sin(angle)
	}
	projectiles.push(new Projectile(hero.positionX + hero.width / 2, hero.positionY + hero.height / 2, shootDestination));
	shots++;
}

canvas.onmousedown = function (e) {
	generateProjectile(e)
}
let interval;

canvas.addEventListener("mousedown", e => {
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(generateProjectile, 100);
});

canvas.addEventListener("mouseup", e => {
	clearInterval(interval);
});

addEventListener('resize', initCanvasSize);

initCanvasSize();

let hero = new Hero('Unkindled', (canvas.width / 2) - 20, (canvas.height / 2) - 20, 40, 40, 1000, 1000);
let then = Date.now();
let rotate;

let projectiles = [];
let enemies = [];
let maxEnemies = 10;

function drawHud() {
	let hpPercentage = Math.round(((hero.actualHp / hero.maxHp) * 100));

	const hudPanel = document.createElement('div');
	hudPanel.className = 'hudPanel';
	hudPanel.style.left = '10px';
	hudPanel.style.top = document.documentElement.clientHeight - 50 + 'px';
	document.getElementsByTagName('html')[0].appendChild(hudPanel);
	const hpParentDiv = document.createElement('div');
	hpParentDiv.id = 'hpParentDiv';
	hpParentDiv.style.minWidth = '150px';
	hpParentDiv.style.display = 'flex';
	hpParentDiv.style.alignItems = 'center';
	hpParentDiv.innerText = 'HP: ';
	const hpPercentageText = document.createElement('div');
	hpPercentageText.id = 'hpPercentageText';
	hpPercentageText.style.width = hpPercentage + 'px';
	hpPercentageText.style.height = '10px';
	hpPercentageText.style.backgroundColor = 'black';
	hpPercentageText.style.margin = '0 5px';
	hpParentDiv.appendChild(hpPercentageText);
	const heroLevelText = document.createElement('span');
	heroLevelText.id = 'heroLevelText';
	heroLevelText.innerText = 'Lvl: ' + hero.level;
	const shotsText = document.createElement('span');
	shotsText.id = 'shotsText';
	shotsText.innerText = 'Shots: ' + shots;
	const heroWeaponText = document.createElement('span');
	heroWeaponText.id = 'heroWeaponText';
	heroWeaponText.innerText = 'Weapon: ' + hero.weapon;
	const deadEnemiesText = document.createElement('span');
	deadEnemiesText.id = 'deadEnemiesText';
	deadEnemiesText.innerText = 'Kills: ' + deadEnemies;
	hudPanel.appendChild(hpParentDiv);
	hudPanel.appendChild(heroLevelText);
	hudPanel.appendChild(shotsText);
	hudPanel.appendChild(heroWeaponText);
	hudPanel.appendChild(deadEnemiesText);
	//context.fillStyle = (hpPercentage >= 66) ? good : (33 <= hpPercentage && hpPercentage <= 66) ? normal : (hpPercentage <= 33) ? bad : "#000000";
	//context.fillRect(10, canvas.height - 50, hpLine, 30);
}

function updateHud() {
	document.getElementById('hpPercentageText').style.width = Math.round(((hero.actualHp / hero.maxHp) * 100)) + 'px';
	document.getElementById('heroLevelText').innerText = 'Lvl: ' + hero.level;
	document.getElementById('shotsText').innerText = 'Shots: ' + shots;
	document.getElementById('heroWeaponText').innerText = 'Weapon: ' + hero.weapon;
	document.getElementById('deadEnemiesText').innerText = 'Kills: ' + deadEnemies;
}

let hps = [];
function drawHp() {
	for (let i = 0; i < hps.length; i++) {
		context.beginPath();
		context.arc(hps[i].x, hps[i].y, hps[i].rad, 0, 10);
		context.fillStyle = 'white';
		context.fill();

		context.lineWidth = 1;
		context.strokeStyle = 'red';
		context.stroke();
		context.closePath();

		context.beginPath();
		context.moveTo(hps[i].x - hps[i].rad, hps[i].y);
		context.lineTo(hps[i].x + hps[i].rad, hps[i].y);
		context.moveTo(hps[i].x, hps[i].y - hps[i].rad);
		context.lineTo(hps[i].x, hps[i].y + hps[i].rad);
		context.lineWidth = Math.round(hps[i].rad / 2);
		context.stroke();
		context.lineWidth = 1;
		context.closePath();


		let dx = (hps[i].x + 25) - (hero.positionX + hero.width / 2);
		let dy = (hps[i].y + 25) - (hero.positionY + hero.height / 2);
		let rSum = 25 + hero.width / 2;
		if (dx * dx + dy * dy <= rSum * rSum) {
			hero.actualHp = hero.actualHp + 5;
		}
	}
}

function drawObjects(delta) {
	drawMap(canvas, context);
	if (randomInterval(0, 1000) == 5) {
		hps = [];
		hps.push(
			{
				x: randomInterval(0, canvas.width),
				y: randomInterval(0, canvas.height),
				rad: 15
			})
	};
	hps = hps.filter(e => !e.used);
	drawHp();

	for (let projectile of projectiles) {
		projectile.step(delta / 1000, enemies);
	}

	for (let enemy of enemies) {
		enemy.step(delta / 1000, hero, enemies);
	}
	hero.draw();
}

function generateEnemies() {
	if (enemies.length <= 3) {
		for (let i = 0; i < randomInterval(0, maxEnemies); i++) {
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


function stop() {
	cancelAnimationFrame(animId);
	const gameoverdiv = document.createElement('div');
	gameoverdiv.className = 'gameOver';
	gameoverdiv.style.width = 500 + 'px';
	gameoverdiv.style.height = 300 + 'px';
	gameoverdiv.style.left = document.documentElement.clientWidth / 2 - 250 + 'px';
	gameoverdiv.style.top = document.documentElement.clientHeight / 2 - 150 + 'px';
	gameoverdiv.innerText = 'Game Over';
	const retry = document.createElement('button');
	retry.innerHTML = 'Retry';
	retry.onclick = () => document.location.reload();
	gameoverdiv.appendChild(retry);
	document.getElementsByTagName('html')[0].appendChild(gameoverdiv);
}

function start() {
	animId = requestAnimationFrame(main);
}

let animId;
let deadEnemies = 0;
let gameOver = false;
const main = function () {
	context.clearRect(0, 0, innerWidth, innerHeight);
	const now = Date.now();
	const delta = now - then;
	hero.step(delta / 1000, enemies);
	then = now;
	projectiles = projectiles.filter(p => p.hit !== true && p.positionX > 0 && p.positionX < canvas.width && p.positionY > 0 && p.positionY < canvas.height);
	enemies = enemies.filter(e => e.hp > 0);
	drawObjects(delta);
	generateEnemies();
	updateHud();
	if (gameOver) {
		stop();
	} else {
		animId = requestAnimationFrame(main);
	}
}

drawHud();
main();
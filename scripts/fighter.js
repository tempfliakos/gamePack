"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const Mcanvas = document.getElementById('mapCanvas');
const Mcontext = Mcanvas.getContext('2d');

function initCanvasSize() {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	Mcanvas.width = document.documentElement.clientWidth;
	Mcanvas.height = document.documentElement.clientHeight;
	$('body').height(document.documentElement.clientHeight);
	$('#options').css('left', - 310);
	$('#options').css('top', 0);
	$('#options').css('height', canvas.height);
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

let shooting = false;
canvas.onmousedown = function (e) {
	generateProjectile(e)
	shooting = true;
}

addEventListener('keydown', e => {
	if (e.code == 'Escape') {
		paused = !paused;
		if (paused) {
			stop();
			document.getElementById('options').style.left = '0px';
		} else {
			start();
			document.getElementById('options').style.left = '-310px';
		};

	}
})
let interval;

canvas.addEventListener("mousedown", e => {
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(generateProjectile, 100);
});

canvas.addEventListener("mouseup", e => {
	clearInterval(interval);
	shooting = false;
});

addEventListener('resize', initCanvasSize);

initCanvasSize();

let hero = new Hero((canvas.width / 2) - 20, (canvas.height / 2) - 20);
let then = Date.now();
let rotate;

let projectiles = [];
let enemies = [];
let actualLevel = levels[0];

function drawHud() {
	let hpPercentage = Math.round(((hero.actualHp / hero.maxHp) * 100));

	const hudPanel = document.createElement('div');
	hudPanel.className = 'hudPanel';
	hudPanel.style.left = '10px';
	hudPanel.style.top = document.documentElement.clientHeight - 50 + 'px';
	document.getElementsByTagName('html')[0].appendChild(hudPanel);
	const hpParentDiv = document.createElement('div');
	hpParentDiv.id = 'hpParentDiv';
	hpParentDiv.style.width = '150px';
	hpParentDiv.style.display = 'flex';
	hpParentDiv.style.alignItems = 'center';
	hpParentDiv.innerText = 'HP: ';
	const hpPercentageText = document.createElement('div');
	hpPercentageText.id = 'hpPercentageText';
	hpPercentageText.style.width = hpPercentage / 10 + 'px';
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
	heroWeaponText.innerText = 'Weapon: ' + hero.weapon.type;
	const deadEnemiesText = document.createElement('span');
	deadEnemiesText.id = 'deadEnemiesText';
	deadEnemiesText.innerText = 'Kills: ' + deadEnemies;
	hudPanel.appendChild(hpParentDiv);
	hudPanel.appendChild(heroLevelText);
	hudPanel.appendChild(shotsText);
	hudPanel.appendChild(heroWeaponText);
	hudPanel.appendChild(deadEnemiesText);
}

function updateHud() {
	document.getElementById('hpPercentageText').style.width = Math.round(((hero.actualHp / hero.maxHp) * 100)) + 'px';
	document.getElementById('heroLevelText').innerText = 'Lvl: ' + hero.level;
	document.getElementById('shotsText').innerText = 'Shots: ' + shots;
	document.getElementById('heroWeaponText').innerText = 'Weapon: ' + hero.weapon.type;
	document.getElementById('deadEnemiesText').innerText = 'Kills: ' + deadEnemies;
}

let hps = [];
let healed = false;
function drawHp() {
	if (hps.length > 0) {
		context.beginPath();
		context.arc(hps[0].x, hps[0].y, hps[0].rad, 0, 10);
		context.fillStyle = 'white';
		context.fill();
		context.closePath();

		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = 'red';
		context.stroke();
		context.closePath();

		context.beginPath();
		context.moveTo(hps[0].x - hps[0].rad, hps[0].y);
		context.lineTo(hps[0].x + hps[0].rad, hps[0].y);
		context.moveTo(hps[0].x, hps[0].y - hps[0].rad);
		context.lineTo(hps[0].x, hps[0].y + hps[0].rad);
		context.lineWidth = Math.round(hps[0].rad / 2);
		context.stroke();
		context.lineWidth = 1;
		context.closePath();
		context.strokeStyle = 'black';

		let dx = (hps[0].x + 25) - (hero.positionX + hero.width / 2);
		let dy = (hps[0].y + 25) - (hero.positionY + hero.height / 2);
		let rSum = 25 + hero.width / 2;
		if (dx * dx + dy * dy <= rSum * rSum) {
			hero.actualHp = hero.actualHp + 5;
			if (hero.actualHp > hero.maxHp) {
				hero.actualHp = hero.maxHp;
			}
			healed = true;
		}
	}
	if (healed) { hps = [] };
}

function drawObjects(delta) {
	drawMap(Mcanvas, Mcontext);
	if (randomInterval(0, 1000) == 5) {
		hps = []
		healed = false;
		hps.push(
			{
				x: randomInterval(0, canvas.width),
				y: randomInterval(0, canvas.height),
				rad: 15
			})
	};
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
	let availableEnemiesArray = availableEnemies();
	if (enemies.length <= actualLevel.minEnemyOnScreen && availableEnemiesArray.length > 0) {
		for (let i = 0; i < randomInterval(0, actualLevel.maxEnemyOnScreen); i++) {
			let sideRandom = Math.random();
			let enemy;
			let enemyType = randomEnemy();
			actualLevel.enemies[enemyType] -= 1;
			if (sideRandom > 0 && sideRandom <= 0.25) {
				enemy = new Enemy(randomInterval(0, canvas.width), 0, enemyTypesMap[enemyType]);
			} else if (sideRandom > 0.25 && sideRandom <= 0.5) {
				enemy = new Enemy(canvas.width, randomInterval(0, canvas.height), enemyTypesMap[enemyType]);
			} else if (sideRandom > 0.5 && sideRandom <= 0.75) {
				enemy = new Enemy(randomInterval(0, canvas.width), canvas.height, enemyTypesMap[enemyType]);
			} else if (sideRandom > 0.75 && sideRandom <= 1) {
				enemy = new Enemy(0, randomInterval(0, canvas.height), enemyTypesMap[enemyType]);
			}
			enemies.push(enemy);
		}
	} else if(enemies.length == 0 && availableEnemiesArray == 0) {
		actualLevel = levels[actualLevel.id];
	}
}

function randomInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function availableEnemies() {
	let available = [];
	Object.keys(actualLevel.enemies).forEach(function(key) {
		if(actualLevel.enemies[key] > 0) {
			available.push(key);
		}
	  })
	return available;
}

function randomEnemy() {
	let available = availableEnemies();
	return available[randomInterval(0, available.length-1)];
}


function stop() {
	cancelAnimationFrame(animId);
	if (gameOver) {
		document.getElementById('options').style.visibility = 'visible';
		return;
	}
	if (paused) {
		console.log('paused');
	}
}

function start() {
	then = Date.now();
	animId = requestAnimationFrame(main);
}

let animId;
let deadEnemies = 0;
let gameOver = false;
let paused = undefined;
const main = function () {
	if (!paused) {
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
			document.getElementById('options').style.left = '0px';
		} else {
			animId = requestAnimationFrame(main);
		}
	}
}

drawHud();
main();
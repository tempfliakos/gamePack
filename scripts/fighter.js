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
	$(window).blur(function () {
		paused = true;
		stop();
	});
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
		} else {
			start();
			document.getElementById('options').style.left = '-310px';
			if (document.getElementById('upgradeDiv').style.visibility = 'visible') {
				document.getElementById('upgradeDiv').style.visibility = 'hidden';
			}
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

function upgrade() {
	if ($('#holderDiv').length > 0) {
		document.getElementById('upgradeDiv').innerHTML = "";
	}

	document.getElementById('upgradeDiv').style.visibility = 'visible';
	let heroxp = document.createElement('label');
	heroxp.innerText = 'Available XP: ' + hero.xp;
	heroxp.style.fontWeight = 'bold';
	heroxp.id = 'heroXP';
	document.getElementById('upgradeDiv').appendChild(heroxp);
	let holderDiv = document.createElement('div');
	holderDiv.id = 'holderDiv';
	document.getElementById('upgradeDiv').appendChild(holderDiv);

	let upgradesList = [hero.upgrades, hero.weapon.upgrades];
	for (let i = 0; i < upgradesList.length; i++) {
		for (const [key, value] of Object.entries(upgradesList[i])) {
			let parent = document.createElement('div');
			let name = document.createElement('label');
			name.innerText = i == 0 ? `Hero ${key}: ` : `Wapon ${key}: `;
			let number = document.createElement('label');
			number.innerText = `${value}`;
			let buttonParent = document.createElement('div');
			buttonParent.id = 'buttonParent';
			let minus = document.createElement('button');
			minus.innerText = '-'
			minus.onClick = ()=>{};
			let plus = document.createElement('button');
			plus.innerText = '+';
			plus.onClick = ()=>{};

			buttonParent.appendChild(minus);
			buttonParent.appendChild(plus);
			parent.appendChild(name);
			parent.appendChild(number);
			parent.appendChild(buttonParent);
			document.getElementById('holderDiv').appendChild(parent);
		}
	}


	document.getElementById('upgradeDiv').style.left = (document.documentElement.clientWidth / 2) - (document.getElementById('upgradeDiv').getBoundingClientRect().width / 2) + 'px';
	document.getElementById('upgradeDiv').style.top = (document.documentElement.clientHeight / 2) - (document.getElementById('upgradeDiv').getBoundingClientRect().height / 2) + 'px';
}

let hudElements = [];
function drawHud() {
	hudElements = [
		{ id: 'hpPercentageText', text: 'HP: ', data: Math.round(((hero.actualHp / hero.maxHp) * 100)) },
		{ id: 'heroLevelText', text: 'Lvl: ', data: hero.level },
		{ id: 'heroXp', text: 'XP: ', data: hero.xp },
		{ id: 'shotsText', text: 'Shots: ', data: shots },
		{ id: 'heroWeaponText', text: 'Weapon: ', data: hero.weapon.type },
		{ id: 'deadEnemiesText', text: 'Kills: ', data: deadEnemies },
		{ id: 'actualLevel', text: 'Map: ', data: actualLevel.name }
	];

	for (let i = 0; i < hudElements.length; i++) {
		if ($('#' + hudElements[i].id).length > 0) {
			document.getElementById(hudElements[i].id).innerText = hudElements[i].text + hudElements[i].data;
		} else {
			const element = document.createElement('span');
			element.id = hudElements[i].id;
			element.innerText = hudElements[i].text + hudElements[i].data;
			document.getElementById('hudPanel').appendChild(element);
		}
	}

	if (document.getElementById('hudPanel').style.top == "") {
		document.getElementById('hudPanel').style.top = document.documentElement.clientHeight -
			document.getElementById('hudPanel').getBoundingClientRect().height + 'px';
	}
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
	//drawMap(Mcanvas, Mcontext);

	drawHud();
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
	} else if (enemies.length == 0 && availableEnemiesArray == 0) {
		actualLevel = levels[actualLevel.id];
	}
}

function randomInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function availableEnemies() {
	let available = [];
	Object.keys(actualLevel.enemies).forEach(function (key) {
		if (actualLevel.enemies[key] > 0) {
			available.push(key);
		}
	})
	return available;
}

function randomEnemy() {
	let available = availableEnemies();
	return available[randomInterval(0, available.length - 1)];
}


function stop() {
	cancelAnimationFrame(animId);
	if (gameOver) {
		document.getElementById('options').style.left = '0px';
		document.getElementById('state').innerText = '';
		canvas.remove();
		Mcanvas.style.backgroundColor = '#f54d4d';
		let youDied = document.createElement('div');
		youDied.className = 'youdied';
		youDied.innerText = 'YOU DIED';
		document.getElementsByTagName('body')[0].appendChild(youDied);
		return;
	}
	if (paused) {
		document.getElementById('options').style.left = '0px';
		document.getElementById('state').innerText = 'Paused';
	}
}

function start() {
	then = Date.now();
	animId = requestAnimationFrame(main);
}

var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
function fpsCalc() {
	var sec = Math.floor(Date.now() / 1000);
	if (sec != currentSecond) {
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}
	else { frameCount++; }

	document.getElementById('fps').innerText = 'FPS: ' + framesLastSecond;
}

let shadow = false;
let animId;
let deadEnemies = 0;
let gameOver = false;
let paused = undefined;

const main = function () {
	try {
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
			if (gameOver) {
				stop();
			} else {
				animId = requestAnimationFrame(main);
			}
			fpsCalc();
		}
	} catch (e) {
		let hiba = document.createElement('div');
		hiba.style.position = 'absolute';
		hiba.style.padding = '5px';
		hiba.style.left = '10px';
		hiba.style.top = '10px';
		hiba.style.backgroundColor = 'red';
		hiba.style.color = 'white';
		hiba.style.fontSize = '2em';
		hiba.innerText = e;
		hiba.style.zIndex = '3';
		document.getElementsByTagName('body')[0].appendChild(hiba);
		console.error(e);
	}

}

main();
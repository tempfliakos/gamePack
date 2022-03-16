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

initCanvasSize();

let hero = new Hero((canvas.width / 2) - 20, (canvas.height / 2) - 20);
let then = Date.now();
let rotate;

let projectiles = [];
let enemies = [];
let actualLevel = levels[0];

let shots = 0;
function generateProjectile() {
	if (hero.weapon.ammo > 0 && !paused) {
		const angle = Math.atan2(mouse.y - hero.positionY, mouse.x - hero.positionX);
		const shootDestination = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		}
		projectiles.push(new Projectile(hero.positionX + hero.width / 2, hero.positionY + hero.height / 2, shootDestination));
		shots++;
		hero.weapon.ammo--;
		updateWeaponAmmo();
	} else {
		shooting = false;
	}
}

let shooting = false;
canvas.onmousedown = function (e) {
	generateProjectile(e);
	if (hero.weapon.ammo > 0) {
		shooting = true;
	}
}

addEventListener('keydown', e => {
	if (e.code == 'Escape') {
		paused = !paused;
		if (paused) {
			stop();
		} else {
			start();
			document.getElementById('options').style.left = '-310px';
			if (document.getElementById('optionsPopup').style.visibility = 'visible') {
				document.getElementById('optionsPopup').style.visibility = 'hidden';
			}
		};
	}
	//teleport
	if ('KeyT' in keysDown) {
		hero.positionX = randomInterval(0, document.documentElement.clientWidth);
		hero.positionY = randomInterval(0, document.documentElement.clientHeight);
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

canvas.addEventListener("mousewheel", e => {
	if (!paused) {
		let actualWeaponIndex = hero.ownedWeapons.findIndex((weaponRef) => weaponRef === hero.weapon.ref);
		const weaponsMapMaxIndex = hero.ownedWeapons.length - 1;
		if (e.deltaY > 0) {
			actualWeaponIndex = actualWeaponIndex == 0 ? weaponsMapMaxIndex : --actualWeaponIndex;
		} else {
			actualWeaponIndex = actualWeaponIndex == weaponsMapMaxIndex ? 0 : ++actualWeaponIndex;
		}
		hero.weapon = weapons[weaponsMap[hero.ownedWeapons[actualWeaponIndex]]];
		drawWeapon();
	}
});

addEventListener('resize', initCanvasSize);



function optionsPopup(buttonid) {
	document.getElementById('optionsPopup').innerHTML = "";
	document.getElementById('optionsPopup').style.visibility = 'visible';

	switch (buttonid) {
		case 'upgradeBtn':
			upgrade();
			break;
		case 'saveBtn':
			save();
			break;
		case 'loadBtn':
			load();
			break;
		case 'storeBtn':
			(async () => {
				store();
				await waitForImage(document.getElementById('weaponStoreImg3'));
				document.getElementById('optionsPopup').style.left = (document.documentElement.clientWidth / 2) - (document.getElementById('optionsPopup').getBoundingClientRect().width / 2) + 'px';
				document.getElementById('optionsPopup').style.top = (document.documentElement.clientHeight / 2) - (document.getElementById('optionsPopup').getBoundingClientRect().height / 2) + 'px';
			})();
			break;
	}

	document.getElementById('optionsPopup').style.left = (document.documentElement.clientWidth / 2) - (document.getElementById('optionsPopup').getBoundingClientRect().width / 2) + 'px';
	document.getElementById('optionsPopup').style.top = (document.documentElement.clientHeight / 2) - (document.getElementById('optionsPopup').getBoundingClientRect().height / 2) + 'px';
}

function store() {
	let attributePoints = document.createElement('label');
	attributePoints.innerText = 'Attribute Points: ' + hero.attributePoints;
	attributePoints.style.fontWeight = 'bold';
	attributePoints.id = 'StoreAttributePoints';
	document.getElementById('optionsPopup').appendChild(attributePoints);

	for (const [key, value] of Object.entries(weaponsMap)) {
		let weaponStoreImg = document.createElement('img');
		weaponStoreImg.classList.add('weaponStoreImg');
		if (weapons[value].price <= hero.attributePoints) {
			if (!hero.ownedWeapons.includes(key)) {
				weaponStoreImg.classList.add('buyableWeapon');
				weaponStoreImg.onclick = () => {
					hero.attributePoints -= weapons[value].price;
					hero.ownedWeapons.push(key);
					optionsPopup('storeBtn');
				};
			}
		} else {
			if (!hero.ownedWeapons.includes(key)) {
				weaponStoreImg.classList.add('lockedWeapon');
			}
		}
		weaponStoreImg.id = 'weaponStoreImg' + value;
		weaponStoreImg.src = weapons[value].src;
		weaponStoreImg.title = weapons[value].price + ' Attr. point';
		document.getElementById('optionsPopup').appendChild(weaponStoreImg);
	}
}

function loadGame() {
	let loadData = document.getElementById('loadInput').value;
	if (loadData.length > 0) {
		const heroJSON = JSON.parse(decryption(loadData));
		hero = new Hero(heroJSON.positionX, heroJSON.positionY, heroJSON.name, heroJSON.width, heroJSON.height, heroJSON.hp, heroJSON.upgrades, heroJSON.appearence, heroJSON.level, heroJSON.weapon, heroJSON.xp, heroJSON.attributePoints, heroJSON.ownedWeapons);
	}
}

function load() {
	let loadLabel = document.createElement('label');
	loadLabel.innerText = 'Saved game hash: ';
	loadLabel.id = 'loadLabel';
	loadLabel.for = 'loadInput';
	let loadInput = document.createElement('input');
	loadInput.id = 'loadInput';
	let loadGameBtn = document.createElement('button');
	loadGameBtn.id = 'loadGameBtn';
	loadGameBtn.innerText = 'Load Game';
	loadGameBtn.onclick = loadGame;
	document.getElementById('optionsPopup').appendChild(loadLabel);
	document.getElementById('optionsPopup').appendChild(loadInput);
	document.getElementById('optionsPopup').appendChild(loadGameBtn);
}

function save() {
	let saveString = document.createElement('label');
	let heroJSON = encryption(JSON.stringify(hero));
	saveString.innerText = 'Your saved game hash is: \n' + heroJSON;
	saveString.id = 'saveString';
	document.getElementById('optionsPopup').appendChild(saveString);
}

const secret = 'ShootThemAll';
function encryption(str) {
	return CryptoJS.AES.encrypt(str, secret)
}

function decryption(str) {
	let decrypted = CryptoJS.AES.decrypt(str, secret);
	return decrypted.toString(CryptoJS.enc.Utf8)
}

function upgrade() {
	document.getElementById('optionsPopup').innerHTML = "";
	let heroxp = document.createElement('label');
	heroxp.innerText = 'Attribute Points: ' + hero.attributePoints;
	heroxp.style.fontWeight = 'bold';
	heroxp.id = 'heroXP';
	document.getElementById('optionsPopup').appendChild(heroxp);
	let holderDiv = document.createElement('div');
	holderDiv.id = 'holderDiv';
	document.getElementById('optionsPopup').appendChild(holderDiv);

	let upgradesList = [hero.upgrades, hero.weapon.upgrades];
	for (let i = 0; i < upgradesList.length; i++) {
		for (const [key, value] of Object.entries(upgradesList[i])) {
			let parent = document.createElement('div');
			let name = document.createElement('label');
			name.innerText = i == 0 ? `Hero ${key}: ` : `Weapon ${key}: `;
			let number = document.createElement('label');
			number.innerText = `${value}`;
			let buttonParent = document.createElement('div');
			buttonParent.id = 'buttonParent';
			let plus = document.createElement('button');
			plus.innerText = '+';
			plus.onclick = () => {
				if (i == 0) {
					hero.upgrade(key);
				} else if (i == 1) {

				}
				upgrade();
			};
			if (hero.attributePoints < 1) {
				plus.disabled = 'disabled';
			}

			buttonParent.appendChild(plus);
			parent.appendChild(name);
			parent.appendChild(number);
			parent.appendChild(buttonParent);
			document.getElementById('holderDiv').appendChild(parent);
		}
	}
}

let hudElements = [];
function drawHud() {
	hudElements = [
		{ id: 'hpPercentageText', text: 'HP: ', data: hero.actualHp < 0 ? 0 + '/' + hero.maxHp : hero.actualHp + '/' + hero.maxHp },
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
let hpImage = new Image();
hpImage.src = '../resources/hp.svg';
function drawHp() {
	if (hps.length > 0) {
		if (hps[0].timeout > new Date()) {
			context.beginPath();
			context.drawImage(hpImage, hps[0].x, hps[0].y, hps[0].width, hps[0].height);
			let date = hps[0].timeout - new Date();
			context.fillStyle = 'black';
			context.fillText(date / 1000, hps[0].x, hps[0].y - 10);
			context.closePath();

			let dx = (hps[0].x + 25) - (hero.positionX + hero.width / 2);
			let dy = (hps[0].y + 25) - (hero.positionY + hero.height / 2);
			let rSum = 25 + hero.width / 2;
			if (dx * dx + dy * dy <= rSum * rSum) {
				hero.actualHp = hero.actualHp + hps[0].healPoint;
				if (hero.actualHp > hero.maxHp) {
					hero.actualHp = hero.maxHp;
				}
				healed = true;
			}
		} else {
			hps = [];
		}
	}
	if (healed) { hps = [] };
}

function waitForImage(imgElem) {
	return new Promise(res => {
		if (imgElem.complete) {
			return res();
		}
		imgElem.onload = () => res();
		imgElem.onerror = () => res();
	});
}


function drawWeapon() {
	(async () => {
		document.getElementById('weaponImg').src = '';
		document.getElementById('weaponImg').src = hero.weapon.src;
		document.getElementById('weaponAmmo').innerText = hero.weapon.ammo + '/' + hero.weapon.maxAmmo;
		await waitForImage(document.getElementById('weaponImg'));
		document.getElementById('weaponDiv').style.left = document.documentElement.clientWidth - document.getElementById('weaponDiv').getBoundingClientRect().width - 10 + 'px';
	})();
}

function updateWeaponAmmo() {
	document.getElementById('weaponAmmo').innerText = hero.weapon.ammo + '/' + hero.weapon.maxAmmo;
}

function showInfoLabel(infoText) {
	let infoLabel = document.createElement('label');
	infoLabel.id = 'infoLabel';
	infoLabel.className = 'infoLabel';
	infoLabel.innerText = infoText;
	document.getElementsByTagName('body')[0].appendChild(infoLabel);
	document.getElementById('infoLabel').style.left = document.documentElement.clientWidth / 2 - document.getElementById('infoLabel').getBoundingClientRect().width / 2 + 'px';
	document.getElementById('infoLabel').style.top = document.documentElement.clientHeight / 2 - document.getElementById('infoLabel').getBoundingClientRect().height / 2 + 'px';
	document.getElementById('infoLabel').style.opacity = 0.6;
	setTimeout(() => {
		document.getElementById('infoLabel').style.opacity = 0;
	}, 5000);
	setTimeout(() => {
		document.getElementById('infoLabel').remove();
	}, 7000);
}

function drawObjects(delta) {
	//drawMap(Mcanvas, Mcontext);
	if (shadow) {
		context.beginPath();
		context.shadowColor = 'black';
		context.shadowBlur = 10;
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.fill();
		context.closePath();
	} else {
		context.shadowColor = "transparent";
	}

	for (let i = 0; i < enemyHits.length; i++) {
		if (bloodDisapear && enemyHits[i].timeout < new Date()) {
			enemyHits.splice(i, 1);
		} else {
			context.beginPath();

			//sebzes
			//context.font = "20px Arial";
			//context.fillText(enemyHits[i].damage, enemyHits[i].x + (enemyHits[i].enemyProt.width / 2), enemyHits[i].y - 10);

			//blood
			context.fillStyle = enemyHits[i].bloodColor;
			context.arc(
				enemyHits[i].x + enemyHits[i].enemyProt.width / 2,
				enemyHits[i].y + enemyHits[i].enemyProt.height / 2,
				enemyHits[i].rad,
				0,
				10);
			context.fill();
			context.closePath();
		}
	}
	drawHud();
	if ((hero.actualHp / hero.maxHp) < 0.3 && hps.length < 1) {
		hps = []
		healed = false;
		hps.push(
			{
				x: randomInterval(0, canvas.width),
				y: randomInterval(0, canvas.height),
				width: 25,
				height: 30,
				timeout: addSeconds(20),
				healPoint: 10
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
			if (availableEnemiesArray.length > 0) {
				let sideRandom = Math.random();
				let enemy;
				let enemyType = randomEnemy(availableEnemiesArray);
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
				availableEnemiesArray = availableEnemies();
			}
		}
	} else if (enemies.length == 0 && availableEnemiesArray == 0) {
		actualLevel = levels[actualLevel.id];
		showInfoLabel(actualLevel.name);
	}
}

function randomInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function availableEnemies() {
	let available = [];
	Object.keys(actualLevel.enemies).forEach(function (key) {
		if (actualLevel.enemies[key] > 0 && key !== "boss") {
			available.push(key);
		}
	})
	if (available.length == 0 && enemies.length == 0 && actualLevel.enemies.boss > 0) {
		available.push("boss");
	}
	return available;
}

function randomEnemy(available) {
	return available[randomInterval(0, available.length - 1)];
}


function stop() {
	cancelAnimationFrame(animId);
	if (gameOver) {
		if ($('#youDied').length < 1) {
			document.getElementById('options').style.left = '0px';
			document.getElementById('state').innerText = '';
			document.getElementById('upgradeBtn').disabled = 'disabled';
			canvas.remove();
			Mcanvas.style.backgroundColor = '#f54d4d';
			let youDied = document.createElement('div');
			youDied.id = 'youDied';
			youDied.className = 'youdied';
			youDied.innerText = 'YOU DIED';
			document.getElementsByTagName('body')[0].appendChild(youDied);
		}
		return;
	}
	if (paused) {
		document.getElementById('options').style.left = '0px';
		document.getElementById('state').innerText = 'Paused';
	}
}

function start() {
	if (!gameOver) {
		then = Date.now();
		animId = requestAnimationFrame(main);
	}
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

function addSeconds(sec, date = new Date()) {
	date.setSeconds(date.getSeconds() + sec);
	return date;
}

function setShadow() {
	shadow = document.getElementById('shadowChck').checked;
}

function setBloodDisapear() {
	bloodDisapear = document.getElementById('bloodChck').checked;
}

let bloodDisapear = true;
let shadow = false;
let animId;
let deadEnemies = 0;
let gameOver = false;
let paused = undefined;
let enemyHits = [];
const main = function () {
	try {
		if (!paused || !gameOver) {
			context.clearRect(0, 0, innerWidth, innerHeight);
			const now = Date.now();
			const delta = now - then;
			hero.step(delta / 1000, enemies);
			then = now;
			projectiles = projectiles.filter(p => p.hit !== true && p.positionX > 0 && p.positionX < canvas.width && p.positionY > 0 && p.positionY < canvas.height);
			enemies = enemies.filter(e => e.hp > 0);
			generateEnemies();
			if (gameOver) {
				stop();
			} else {
				animId = requestAnimationFrame(main);
			}
			drawObjects(delta);
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

drawWeapon();
main();
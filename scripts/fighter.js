"use strict";

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const Mcanvas = document.getElementById('mapCanvas');
const Mcontext = Mcanvas.getContext('2d');
let deviceType = undefined;

function initCanvasSize() {
	deviceType = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
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
let lastShootTime = new Date();
function generateProjectile() {
	if (hero.weapon.ammo > 0 && !paused && shootingCooldown(hero.weapon.upgrades.coolDown)) {
		lastShootTime = new Date();
		const angle = Math.atan2(mouse.y - hero.positionY, mouse.x - hero.positionX);
		const shootDestination = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		}
		let weaponX = (hero.positionX + hero.width / 2) + (hero.width / 2 + hero.weapon.weaponSize) * Math.cos(rotate);
		let weaponY = (hero.positionY + hero.height / 2) + (hero.height / 2 + hero.weapon.weaponSize) * Math.sin(rotate);
		projectiles.push(new Projectile(weaponX, weaponY, shootDestination, hero.weapon, Math.atan2(mouse.y - hero.positionY, mouse.x - hero.positionX)));
		playSound(hero.weapon.sound);
		shots++;
		hero.weapon.ammo--;
		updateWeaponAmmo();
	}
}

function shootingCooldown(weaponCooldown) {
	return (new Date() - lastShootTime) > weaponCooldown;
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
		if (isTeleportSkillEnabled) {
			teleportSkill();
			playSound(teleportSound);
		}
	}
})

//folyamatos loves, jobb klikk lenyomva
canvas.onmousedown = function (e) {
	generateProjectile(e);
}

//egyesevel loves, klikk
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
		case 'infoBtn':
			info();
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
	closeButton();
	document.getElementById('optionsPopup').style.left = (document.documentElement.clientWidth / 2) - (document.getElementById('optionsPopup').getBoundingClientRect().width / 2) + 'px';
	document.getElementById('optionsPopup').style.top = (document.documentElement.clientHeight / 2) - (document.getElementById('optionsPopup').getBoundingClientRect().height / 2) + 'px';
}

function closeButton() {
	if ($('#closeBtn').length < 1) {
		let close = document.createElement('button');
		close.id = 'closeBtn';
		close.innerText = 'Close';
		close.style.width = 'auto';
		close.style.margin = 'auto';
		close.style.marginTop = '10px';
		close.onclick = () => { document.getElementById('optionsPopup').style.visibility = 'hidden' };
		document.getElementById('optionsPopup').appendChild(close);
	}
}

let gameInfo = [
	{ key: 'Save', text: 'Copy the given text from the Save popup' },
	{ key: 'Load', text: 'Paste the copied save text and click to the Load Game button' },
	{ key: 'Upgrades', text: 'Get attribute points by leveling and spend it on developing your hero' },
	{ key: 'W', text: 'Move forward' },
	{ key: 'A', text: 'Move left' },
	{ key: 'S', text: 'Move backward' },
	{ key: 'D', text: 'Move right' },
	{ key: 'T', text: 'Teleport' },
	{ key: 'ESCAPE', text: 'Options' },
	{ key: 'SPACE', text: 'Jump' },
	{ key: 'LEFT CLICK', text: 'Shoot' },
	{ key: 'MOUSE WHEEL', text: 'Switch weapon' }
];
function info() {
	for (const i of gameInfo) {
		let info = document.createElement('label');
		info.innerText = i.key + ' -> ' + i.text;
		info.id = 'info' + i.text;
		document.getElementById('optionsPopup').appendChild(info);
	}
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
	paused = !paused;
	start();
	document.getElementById('options').style.left = '-310px';
	if (document.getElementById('optionsPopup').style.visibility = 'visible') {
		document.getElementById('optionsPopup').style.visibility = 'hidden';
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
			name.innerText = i == 0 ? `Hero ${key}: ` : `Actual weapon ${key}: `;
			let number = document.createElement('label');
			number.innerText = `${value}`;
			let buttonParent = document.createElement('div');
			buttonParent.id = 'buttonParent';
			let plus = document.createElement('button');
			plus.innerText = '+';
			plus.onclick = () => {
				i == 0 ? hero.upgrade(key) : hero.upgradeWeapon(key);
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
	closeButton();
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

function showInfoLabel(infoText, fontsize = '3em') {
	let infoLabel = document.createElement('label');
	infoLabel.id = 'infoLabel';
	infoLabel.className = 'infoLabel';
	infoLabel.innerText = infoText;
	infoLabel.style.fontSize = fontsize;
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

let teleportUsed;
function teleportSkill() {
	hero.positionX = randomInterval(0, document.documentElement.clientWidth);
	hero.positionY = randomInterval(0, document.documentElement.clientHeight);
	teleportUsed = new Date();
	isTeleportSkillEnabled = false;
	setTimeout(() => { isTeleportSkillEnabled = true; }, teleportSkillTimer * 1000);
}

function drawExplosion(x, y, width) {
	let explosionRad = width + 20;
	let expl = document.createElement('img');
	expl.src = '../resources/explosion.svg';
	expl.style.position = 'absolute';
	expl.style.width = 0;
	expl.style.height = 0;
	expl.style.left = x + (explosionRad / 2) + 'px';
	expl.style.top = y + (explosionRad / 2) + 'px';
	expl.style.transition = '0.3s';
	expl.style.opacity = 0;
	expl.id = 'expl' + new Date().getTime();
	document.getElementsByTagName('body')[0].appendChild(expl);
	setTimeout(() => {
		document.getElementById(expl.id).style.opacity = 1;
		document.getElementById(expl.id).style.top = document.getElementById(expl.id).getBoundingClientRect().top - (explosionRad / 2) + 'px';
		document.getElementById(expl.id).style.left = document.getElementById(expl.id).getBoundingClientRect().left - (explosionRad / 2) + 'px';
		document.getElementById(expl.id).style.width = explosionRad + 'px';
		document.getElementById(expl.id).style.height = explosionRad + 'px';
	}, 1);
	setTimeout(() => {
		document.getElementById(expl.id).style.opacity = 1;
		document.getElementById(expl.id).style.top = document.getElementById(expl.id).getBoundingClientRect().top + (explosionRad / 2) + 'px';
		document.getElementById(expl.id).style.left = document.getElementById(expl.id).getBoundingClientRect().left + (explosionRad / 2) + 'px';
		document.getElementById(expl.id).style.width = 0;
		document.getElementById(expl.id).style.height = 0;
	}, 300);
	setTimeout(() => { document.getElementById(expl.id).remove() }, 1000);
}

let aliveEnemies = Object.values(baseLevels[actualLevel.id - 1].enemies).reduce((a, b) => a + b);
function drawHud() {
	let hudElements = [
		{ id: 'hpPercentageText', text: 'HP: ', data: hero.actualHp < 0 ? 0 + '/' + hero.maxHp : hero.actualHp + '/' + hero.maxHp },
		{ id: 'heroLevelText', text: 'Lvl: ', data: hero.level },
		{ id: 'heroXp', text: 'XP: ', data: hero.xp },
		{ id: 'attrPoints', text: 'Attribute points: ', data: hero.attributePoints },
		{ id: 'shotsText', text: 'Shots: ', data: shots },
		{ id: 'deadEnemiesText', text: 'Kills: ', data: deadEnemies },
		{ id: 'aliveEnemies', text: 'Level enemies: ', data: aliveEnemies },
		{ id: 'actualLevel', text: 'Map: ', data: actualLevel.name },
		{ id: 'teleportTimer', text: !isTeleportSkillEnabled ? 'Teleport disabled: ' : '', data: !isTeleportSkillEnabled ? Math.round(teleportSkillTimer - (new Date() - teleportUsed) / 1000) + 's' : '' }
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
	if (hps.length > 0) {
		if (hps[0].timeout > new Date()) {
			context.beginPath();
			context.drawImage(hpImage, hps[0].x, hps[0].y, hps[0].width, hps[0].height);
			let date = hps[0].timeout - new Date();
			context.fillStyle = 'black';
			context.fillText(date / 1000, hps[0].x, hps[0].y - 10);
			context.closePath();
			context.fillStyle = null;

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

function drawWeapon() {
	(async () => {
		document.getElementById('weaponImg').src = '';
		document.getElementById('weaponImg').src = hero.weapon.src;
		document.getElementById('weaponAmmo').innerText =
			'ammo: ' + hero.weapon.ammo + '/' + hero.weapon.upgrades.maxAmmo +
			'\n damage: ' + hero.weapon.upgrades.damage +
			'\n range: ' + hero.weapon.upgrades.shootRange +
			'\n coolDown: ' + hero.weapon.upgrades.coolDown;
		await waitForImage(document.getElementById('weaponImg'));
		document.getElementById('weaponDiv').style.left = document.documentElement.clientWidth - document.getElementById('weaponDiv').getBoundingClientRect().width - 10 + 'px';
	})();
}

function updateWeaponAmmo() {
	document.getElementById('weaponAmmo').innerText =
		'ammo: ' + hero.weapon.ammo + '/' + hero.weapon.upgrades.maxAmmo +
		'\n damage: ' + hero.weapon.upgrades.damage +
		'\n range: ' + hero.weapon.upgrades.shootRange +
		'\n coolDown: ' + hero.weapon.upgrades.coolDown;
}

function drawBlood() {
	for (let i = 0; i < enemyHits.length; i++) {
		if (bloodDisapear && enemyHits[i].timeout < new Date()) {
			enemyHits.splice(i, 1);
		} else {
			context.beginPath();

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
			context.fillStyle = null;
		}
	}
}

let barriers = [];
function generateBarriers(num) {
	for (let i = 0; i < num; i++) {
		let size =  randomInterval(50, 150);
		let barrier = {
			x: randomInterval(0, canvas.width),
			y: randomInterval(0, canvas.height),
			width: size,
			height: size,
		}
		barriers.push(barrier);
	}
}

let barrierImage = new Image();
barrierImage.src = '../resources/barrier.png';
function drawBarrier() {
	barriers.forEach((b) => {
		context.beginPath();
		context.drawImage(barrierImage, b.x, b.y, b.width, b.height);
		context.closePath();
	})
}

function drawShadow() {
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
}

function drawObjects(delta) {
	if (hero.weapon.ref == 'sniper') {
		context.moveTo(hero.positionX + hero.width / 2, hero.positionY + hero.height / 2);
		context.lineTo(mouse.x, mouse.y);
		context.strokeStyle = 'red';
		context.stroke();
		context.strokeStyle = 'transparent';
	}
	drawMap(Mcanvas, Mcontext);
	drawShadow();
	drawBlood();
	drawHud();
	drawHp();
	drawBarrier();
	for (let projectile of projectiles) {
		projectile.step(delta / 1000, enemies);
	}
	for (let enemy of enemies) {
		enemy.step(delta / 1000, hero, enemies);
	}
	hero.draw();
}

let lastWin;
function generateEnemies() {
	let availableEnemiesArray = availableEnemies();
	if (enemies.length <= actualLevel.minEnemyOnScreen && availableEnemiesArray.length > 0) {
		for (let i = 0; i < randomInterval(0, actualLevel.maxEnemyOnScreen); i++) {
			if (availableEnemiesArray.length > 0) {
				let sideRandom = Math.random();
				let enemy;
				let enemyType = randomEnemy(availableEnemiesArray);
				actualLevel.enemies[enemyType] -= 1;
				enemy = new Enemy(canvas.width, randomInterval(0, canvas.height), enemyTypesMap[enemyType]);
				enemies.push(enemy);
				availableEnemiesArray = availableEnemies();
			}
		}
	} else if (enemies.length == 0 && availableEnemiesArray == 0) {
		if (levels[actualLevel.id] !== undefined) {
			actualLevel = levels[actualLevel.id];
			aliveEnemies = Object.values(baseLevels[actualLevel.id - 1].enemies).reduce((a, b) => a + b);
			showInfoLabel(actualLevel.name, '10em');

			//hatter valtozas szintlepessel - figyelni kell majd IndexOutOfBounds-ra - kesobb palya levelbe bele lehetn tenni
			backgroundIndex = backgroundIndex + 1 > 6 ? 6 : ++backgroundIndex;
		} else {
			if (!lastWin || (new Date() - lastWin) > 20000) {
				playSound(winSound, 20000);
			}
			lastWin = new Date();
			stop();
			showInfoLabel('YOU WIN', '15em');
		}
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


setInterval(rockets, randomInterval(10 * 1000, 30 * 1000));
function rockets() {
	if (!paused && !gameOver) {
		let rocketDirection = Math.random() < 0.5;
		let rocket = document.createElement('img');
		rocket.id = 'rocket' + new Date().getTime();
		rocket.src = '../resources/missle.svg';
		rocket.style.position = 'absolute';
		rocket.style.width = randomInterval(50, 150) + 'px';
		rocket.style.zIndex = 3;
		rocket.style.filter = 'drop-shadow(0px ' + randomInterval(50, 300) + 'px 2px black)';
		rocket.style.transition = randomInterval(1, 4) + 's';
		rocket.style.transform = !rocketDirection ? 'rotate(180deg)' : '';
		rocket.style.left = rocketDirection ? canvas.getBoundingClientRect().right + 200 + 'px' : canvas.getBoundingClientRect().left - 200 + 'px';
		rocket.style.top = randomInterval(0, canvas.getBoundingClientRect().height) + 'px';
		document.getElementsByTagName('body')[0].appendChild(rocket);
		setTimeout(() => {
			rocket.style.left = 0 - rocket.getBoundingClientRect().width - 500 + 'px';
			rocket.style.left = rocketDirection ? canvas.getBoundingClientRect().left - 200 + 'px' : canvas.getBoundingClientRect().right + 200 + 'px';
		}, 1000);
		setTimeout(() => { rocket.remove() }, 5000);
		playSound(rocketSound, 2000);
	}
}

function stop() {
	cancelAnimationFrame(animId);
	if (gameOver) {
		if ($('#youDied').length < 1) {
			playSound(diedSound, 7000);
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

function countDown() {
	let counter = document.createElement('label');
	counter.style.position = 'absolute';
	counter.style.left = 0;
	counter.style.top = 0;
	counter.style.fontSize = '40em';
	counter.style.opacity = 0.2;
	counter.innerText = countDownTimerSec;
	document.getElementsByTagName('body')[0].appendChild(counter);

	counter.style.left = canvas.getBoundingClientRect().width / 2 - counter.getBoundingClientRect().width / 2 + 'px';
	counter.style.top = canvas.getBoundingClientRect().height / 2 - counter.getBoundingClientRect().height / 2 + 'px';

	for (let i = 0; i < countDownTimerSec; i++) {
		setTimeout(() => {
			counter.innerText = countDownTimerSec - 1;
			--countDownTimerSec;
			counter.style.left = canvas.getBoundingClientRect().width / 2 - counter.getBoundingClientRect().width / 2 + 'px';
			counter.style.top = canvas.getBoundingClientRect().height / 2 - counter.getBoundingClientRect().height / 2 + 'px';
		}, (i + 1) * 1000);
	}
	setTimeout(() => {
		counter.remove();
		isGameStarted = true;
	}, countDownTimerSec * 1000);
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

function playSound(src, length = 1000) {
	let sound = document.createElement("audio");
	sound.src = src;
	sound.setAttribute("preload", "auto");
	sound.setAttribute("controls", "none");
	sound.style.display = "none";
	document.body.appendChild(sound);
	sound.play();
	setTimeout(() => sound.remove(), length);
}

document.getElementById('bloodChck').checked = bloodDisapear;
document.getElementById('shadowChck').checked = shadow;

let animId;
let deadEnemies = 0;
let gameOver = false;
let paused = undefined;
let enemyHits = [];
let isGameStarted = false;
const main = function () {
	try {
		if (!paused || !gameOver) {
			context.clearRect(0, 0, innerWidth, innerHeight);
			const now = Date.now();
			const delta = now - then;
			hero.step(delta / 1000, enemies);
			then = now;
			projectiles = projectiles.filter(p =>
				p.hit !== true &&
				p.positionX > 0 &&
				p.positionX < canvas.width &&
				p.positionY > 0 &&
				p.positionY < canvas.height &&
				Math.sqrt(Math.pow((p.startPositionX - p.positionX), 2) + Math.pow((p.startPositionY - p.positionY), 2)) < p.type.upgrades.shootRange);
			enemies = enemies.filter(e => e.hp > 0);
			generateEnemies();
			drawObjects(delta);
			fpsCalc();
			if (gameOver) {
				keysDown = {};
				clearInterval(interval);
				stop();
			} else {
				animId = requestAnimationFrame(main);
			}
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
		hiba.style.zIndex = 3;
		document.getElementsByTagName('body')[0].appendChild(hiba);
		console.error(e);
	}

}

generateBarriers(5);
drawWeapon();
countDown();
main();
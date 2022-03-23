const resource = "../resources/";

let isTeleportSkillEnabled = true;
let teleportSkillTimer = 30;
let countDownTimerSec = 5;
let hpImage = new Image();
hpImage.src = resource + 'hp.svg';
let bloodDisapear = true;
let shadow = false;

const enemyExplosionSound = resource + "enemy_explosion.mp3";
const rocketSound = resource + "rocket.mp3";
const stabSound = resource + "stab.mp3";
const teleportSound = resource + "teleport.mp3";
const diedSound = resource + "died.mp3";
const winSound = resource + "win.mp3";

const baseLevels = [{
	"id": 1,
	"name": "Luhansk",
	"groundType": 1,
	"enemies": {
		"low": 25,
		"normal": 3,
		"huge": 1,
		"boss": 1
	},
	"minEnemyOnScreen": 10,
	"maxEnemyOnScreen": 20,
	"reward": 10
},
{
	"id": 2,
	"name": "Kharkiv",
	"groundType": 2,
	"enemies": {
		"low": 30,
		"normal": 1,
		"huge": 0,
		"boss": 0
	},
	"minEnemyOnScreen": 3,
	"maxEnemyOnScreen": 10,
	"reward": 10
},
{
	"id": 3,
	"name": "Mariupol",
	"groundType": 2,
	"enemies": {
		"low": 35,
		"normal": 2,
		"huge": 1,
		"boss": 0
	},
	"minEnemyOnScreen": 3,
	"maxEnemyOnScreen": 10,
	"reward": 10
},
{
	"id": 4,
	"name": "Donetsk",
	"groundType": 2,
	"enemies": {
		"low": 40,
		"normal": 3,
		"huge": 3,
		"boss": 0
	},
	"minEnemyOnScreen": 3,
	"maxEnemyOnScreen": 10,
	"reward": 10
},
{
	"id": 5,
	"name": "Crimea",
	"groundType": 2,
	"enemies": {
		"low": 45,
		"normal": 5,
		"huge": 5,
		"boss": 1
	},
	"minEnemyOnScreen": 3,
	"maxEnemyOnScreen": 10,
	"reward": 10
},
{
	"id": 6,
	"name": "Kyiv",
	"groundType": 2,
	"enemies": {
		"low": 50,
		"normal": 15,
		"huge": 10,
		"boss": 5
	},
	"minEnemyOnScreen": 3,
	"maxEnemyOnScreen": 10,
	"reward": 10
}];

const levels = JSON.parse(JSON.stringify(baseLevels));

const weapons = [
	{
		"type": "Sling-shot",
		"ref": "sling",
		"damage": 1,
		"velocity": 150,
		"color": "#442d0e",
		"radius": 4,
		"width": 0,
		"height": 0,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0,
			"shootRange": 0,
			"coolDown": 0
		},
		"src": resource + "weapon_sling_shot.svg",
		"maxAmmo": 10000,
		"ammo": 10000,
		"ammoType": 'round',
		"price": 0,
		"shootRange": 100,
		"coolDown": 0,
		"sound": resource + "laser_gun.wav"
	},
	{
		"type": "Pistol",
		"ref": "pistol",
		"damage": 3,
		"velocity": 500,
		"color": "black",
		"radius": 2,
		"width": 5,
		"height": 2,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0,
			"shootRange": 0,
			"coolDown": 0,
		},
		"src": resource + "weapon_pistol.svg",
		"maxAmmo": 500,
		"ammo": 500,
		"ammoType": 'triangle',
		"price": 1,
		"shootRange": 200,
		"coolDown": 150,
		"sound": resource + "pistol.mp3"
	},
	{
		"type": "Ak",
		"ref": "ak",
		"damage": 6,
		"velocity": 600,
		"color": "black",
		"radius": 3,
		"width": 10,
		"height": 4,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0,
			"shootRange": 0,
			"coolDown": 0,
		},
		"src": resource + "weapon_ak.svg",
		"maxAmmo": 500,
		"ammo": 500,
		"ammoType": 'triangle',
		"price": 2,
		"shootRange": 300,
		"coolDown": 50,
		"sound": resource + "ak.mp3"
	},
	{
		"type": "Rocket launcher",
		"ref": "rocket",
		"damage": 10,
		"velocity": 5,
		"color": "green",
		"radius": 8,
		"width": 20,
		"height": 10,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0,
			"shootRange": 0,
			"coolDown": 0,
		},
		"src": resource + "weapon_rocket_launcher.svg",
		"maxAmmo": 500,
		"ammo": 500,
		"ammoType": 'triangle',
		"price": 3,
		"shootRange": 4000,
		"coolDown": 1500,
		"sound": resource + "rocket_weapon.mp3"
	},
	{
		"type": "Sniper",
		"ref": "sniper",
		"damage": 20,
		"velocity": 2000,
		"color": "black",
		"radius": 8,
		"width": 12,
		"height": 5,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0,
			"shootRange": 0,
			"coolDown": 0,
		},
		"src": resource + "weapon_sniper.svg",
		"maxAmmo": 50,
		"ammo": 50,
		"ammoType": 'triangle',
		"price": 4,
		"shootRange": 4000,
		"coolDown": 2000,
		"sound": resource + "rocket_weapon.mp3"
	}
];

const weaponsMap = {
	"sling": 0,
	"pistol": 1,
	"ak": 2,
	"rocket": 3,
	"sniper": 4
};

const enemyWeaponsMap = {
	"sling": 0,
};

const enemyWeapons = [
	{
		"type": "Sling-shot",
		"ref": "sling",
		"damage": 1,
		"velocity": 500,
		"color": "#442d0e",
		"radius": 5,
		"width": 0,
		"height": 0,
		"ammoType": 'round',
		"shootRange": 5000,
		"coolDown": 100,
		"sound": resource + "laser_gun.wav"
	}
];

const enemyTypes = [
	{
		"type": "low",
		"hp": 15,
		"damage": 1,
		"damageInterval": 1000,
		"velocity": 100,
		"appearence": resource + "enemy_russia.svg",
		"size": 20,
		"reward": 1,
		"weapon": undefined
	},
	{
		"type": "normal",
		"hp": 30,
		"damage": 5,
		"damageInterval": 1000,
		"velocity": 80,
		"appearence": resource + "enemy_russia.svg",
		"size": 40,
		"reward": 5,
		"weapon": undefined
	},
	{
		"type": "huge",
		"hp": 60,
		"damage": 10,
		"damageInterval": 1000,
		"velocity": 60,
		"appearence": resource + "enemy_russia.svg",
		"size": 80,
		"reward": 10,
		"weapon": undefined
	},
	{
		"type": "boss",
		"hp": 200,
		"damage": 25,
		"damageInterval": 1000,
		"velocity": 50,
		"appearence": resource + "enemy_russia.svg",
		"size": 200,
		"reward": 25,
		"weapon": enemyWeapons[enemyWeaponsMap.sling]
	}
];

const enemyTypesMap = {
	"low": 0,
	"normal": 1,
	"huge": 2,
	"boss": 3
}

const defaultHero = {
	"name": "Hero",
	"hp": 100,
	"velocity": 50,
	"appearence": resource + "hero_ukraine.svg",
	"size": 40,
	"level": 1,
	"weapon": weapons[weaponsMap.sling],
	"ownedWeapons": [weapons[weaponsMap.sling].ref],
	"xp": 0,
	"attributePoints": 10,
	"upgrades": {
		"hp": 0,
		"damage": 0,
		"velocity": 0
	},
	"steps": {
		"hp": 10,
		"damage": 5,
		"velocity": 10
	},
};

const heroLevels = [
	{
		"level": 1,
		"required": 25,
		"reward": 1
	},
	{
		"level": 2,
		"required": 50,
		"reward": 1
	},
	{
		"level": 3,
		"required": 75,
		"reward": 1
	}
];
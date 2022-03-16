const resource = "../resources/";

const levels = [
	{
		"id": 1,
		"name": "Level - 1",
		"groundType": 1,
		"enemies": {
			"low": 10,
			"normal": 7,
			"huge": 3,
			"boss": 1
		},
		"minEnemyOnScreen": 3,
		"maxEnemyOnScreen": 5,
		"reward": 10
	},
	{
		"id": 2,
		"name": "Level - 2",
		"groundType": 2,
		"enemies": {
			"low": 50,
			"normal": 0,
			"huge": 0,
			"boss": 2
		},
		"minEnemyOnScreen": 3,
		"maxEnemyOnScreen": 10,
		"reward": 10
	}
];

const enemyTypes = [
	{
		"type": "low",
		"hp": 15,
		"damage": 1,
		"damageInterval": 1000,
		"velocity": 100,
		"appearence": resource + "enemy_red.svg",
		"size": 20,
		"reward": 1
	},
	{
		"type": "normal",
		"hp": 30,
		"damage": 5,
		"damageInterval": 1000,
		"velocity": 80,
		"appearence": resource + "enemy_blue.svg",
		"size": 40,
		"reward": 5
	},
	{
		"type": "huge",
		"hp": 60,
		"damage": 10,
		"damageInterval": 1000,
		"velocity": 60,
		"appearence": resource + "enemy_yellow.svg",
		"size": 80,
		"reward": 10
	},
	{
		"type": "boss",
		"hp": 200,
		"damage": 25,
		"damageInterval": 1000,
		"velocity": 50,
		"appearence": resource + "enemy_boss.svg",
		"size": 200,
		"reward": 25
	}
];

const enemyTypesMap = {
	"low": 0,
	"normal": 1,
	"huge": 2,
	"boss": 3
}

const weapons = [
	{
		"type": "Sling-shot",
		"ref": "sling",
		"damage": 1,
		"velocity": 150,
		"color": "brown",
		"radius": 4,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0
		},
		"src": "../resources/weapon_sling_shot.svg",
		"maxAmmo": 10000,
		"ammo": 10000,
		"price": 0
	},
	{
		"type": "Pistol",
		"ref": "pistol",
		"damage": 3,
		"velocity": 500,
		"color": "grey",
		"radius": 2,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0
		},
		"src": "../resources/weapon_pistol.svg",
		"maxAmmo": 500,
		"ammo": 500,
		"price": 1
	},
	{
		"type": "Ak",
		"ref": "ak",
		"damage": 6,
		"velocity": 600,
		"color": "black",
		"radius": 3,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0
		},
		"src": "../resources/weapon_ak.svg",
		"maxAmmo": 500,
		"ammo": 500,
		"price": 2
	},
	{
		"type": "Rocket launcher",
		"ref": "rocket",
		"damage": 10,
		"velocity": 50,
		"color": "green",
		"radius": 8,
		"upgrades": {
			"damage": 0,
			"velocity": 0,
			"maxAmmo": 0
		},
		"src": "../resources/weapon_rocket_launcher.svg",
		"maxAmmo": 500,
		"ammo": 500,
		"price": 3
	}
];

const weaponsMap = {
	"sling": 0,
	"pistol": 1,
	"ak": 2,
	"rocket": 3
};

const defaultHero = {
	"name": "Hero",
	"hp": 100,
	"velocity": 50,
	"appearence": resource + "hero.svg",
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
const resource = "../resources/";

const levels = [
    {
        "id": 1,
        "name": "Level - 1",
        "groundType": 1,
        "enemies": {
            "low": 15,
            "normal": 8,
            "huge": 2
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
            "huge": 0
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
    }
];

const enemyTypesMap = {
    "low": 0,
    "normal": 1,
    "huge": 2,
}

const weapons = [
    {
        "type": "Sling-shot",
        "ref": "sling",
        "damage": 1,
        "velocity": 100,
        "color": "black",
        "radius": 4,
        "upgrades": {
            "damage": 0,
            "velocity": 0
        }
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
            "velocity": 0
        }
    },
];

const weaponsMap = {
        "sling": 0,
        "rocket": 1,
};

const defaultHero = {
    "name": "Hero",
    "hp": 100,
    "velocity": 50,
    "appearence": resource + "hero.svg",
    "size": 40,
    "level": 1,
    "weapon": weapons[weaponsMap.sling],
    "xp": 0,
    "attributePoints": 0,
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
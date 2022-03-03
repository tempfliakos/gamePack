const resource = "../resources/";

const levels = [
    {
        "id": 1,
        "name": "Level - 1",
        "groundType": 1,
        "enemies": {
            "low": 15,
            "medium": 8,
            "huge": 2
        },
        "maxEnemyOnScreen": 5,
        "reward": 10
    },
    {
        "id": 2,
        "name": "Level - 2",
        "groundType": 2,
        "enemies": {
            "low": 50,
            "medium": 0,
            "huge": 0
        },
        "maxEnemyOnScreen": 10,
        "reward": 10
    }
];

const enemyTypes = [
    {
        "type": "low",
        "hp": 100,
        "damage": 1,
        "velocity": 100,
        "appearence": resource + "enemy.svg",
        "size": 20,
        "reward": 1
    },
    {
        "type": "medium",
        "hp": 100,
        "damage": 5,
        "velocity": 90,
        "appearence": resource + "enemy.svg",
        "size": 30,
        "reward": 5
    },
    {
        "type": "huge",
        "hp": 100,
        "damage": 10,
        "velocity": 80,
        "appearence": resource + "enemy.svg",
        "size": 40,
        "reward": 10
    }
];

const defaultHero = {
    "name": "Hero",
    "hp": 100,
    "velocity": 100,
    "appearence": resource + "hero.svg",
    "size": 40,
    "level": 1,
    "weapon": "Sling-shot",
    "xp": 0,
    "points": 0,
    "upgrades": {
        "hp": 0,
        "damage": 0,
        "velocity": 0
    }
};

const weapons = [
    {
        "type": "Sling-shot",
        "damage": 10,
        "velocity": 10,
        "upgrades": {
            "damage": 0,
            "velocity": 0
        }
    }
];

const heroLevels = [
    {
        "level": 1,
        "required": 0,
        "reward": 0
    },
    {
        "level": 2,
        "required": 100,
        "reward": 1
    },
    {
        "level": 3,
        "required": 150,
        "reward": 1
    }
];
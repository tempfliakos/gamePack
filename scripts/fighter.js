"use strict";

const canvas = document.getElementById('gameCanvas');

function initCanvasSize() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    $('body').height(document.documentElement.clientHeight);
}

initCanvasSize();
window.addEventListener('resize', initCanvasSize);


const context = canvas.getContext('2d');


class Hero {
    constructor(name, color, positionX, positionY, isEmpty) {
        context.clearRect(0, 0, innerWidth, innerHeight);
        this.name = name;
        this.color = color;
        this.positionX = positionX;
        this.positionY = positionY;
        context.beginPath();
        context.arc(positionX, positionY, 30, 0, Math.PI * 2, false);
        if (isEmpty) {
            context.strokeStyle = color;
            context.stroke();
        } else {
            context.fillStyle = color;
            context.fill();
        }
    }
}

let hero = new Hero('Unkindled', 'green', 50, 50, false);
let hero2 = new Hero('Cursed One', 'red', 100, 100, true);

function animate() {
    requestAnimationFrame(animate);
    hero = new Hero(hero.name, hero.color, hero.positionX, hero.positionY, false);
    //hero2 = new Hero(hero2.name, hero2.color, hero2.positionX, hero2.positionY, true);
}

animate();

document.addEventListener('keydown', step);

function step(e) {
    if (e.code === 'KeyW') {
        hero.positionY -= 5;
    } else if (e.code === 'KeyA') {
        hero.positionX -= 5;
    } else if (e.code === 'KeyS') {
        hero.positionY += 5;
    } else if (e.code === 'KeyD') {
        hero.positionX += 5;
    }
}
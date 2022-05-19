var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var animFrameId;

c.width = document.documentElement.clientWidth;
c.height = document.documentElement.clientHeight;

let colors = ['red', 'yellow', 'green', 'blue', 'brown', 'orange', 'black', 'purple', 'gray', 'cyan', 'pink', 'gold', 'khaki', 'olive'];
let wind = Math.random();
let windDirection = Math.random() > 0.5 ? 'bal' : 'jobb';

let tank = {
	x: 20,
	y: c.height - 10,
	r: 20,
	width: 40,
	height: 40,
	color: 'red'
}

let tank2 = {
	x: randomInterval(c.width / 2, c.width - tank.r),
	y: c.height - 10,
	r: 20,
	width: 40,
	height: 40,
	color: 'blue'
}

let bomb = {
	x: tank.x,
	y: tank.y,
	oldX: tank.x,
	oldY: tank.y,
	xVel: 10,
	yVel: -20,
	g: 1,
	width: 2,
	height: 1
}

window.onkeydown = (e) => {
	if (e.code == 'Space') {
		if (!animFrameId) {
			draw();
		}
	}
	if (e.code == 'ArrowUp') {
		bomb.yVel -= 0.1;
		drawObjects();
	}
	if (e.code == 'ArrowDown') {
		bomb.yVel += 0.1;
		drawObjects();
	}
	if (e.code == 'ArrowLeft') {
		bomb.xVel -= 0.1;
		drawObjects();
	}
	if (e.code == 'ArrowRight') {
		bomb.xVel += 0.1;
		drawObjects();
	}
	document.getElementById('bombout').innerText =
		'Magasság: ' + (bomb.yVel * -1).toFixed(2)
		+ '\n Távolság: ' + bomb.xVel.toFixed(2)
		+ '\n Szél: ' + wind.toFixed(2)
		+ '\n Szélirány: ' + windDirection;
};

function randomInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawTank() {
	drawBarell();
	document.getElementById('bombout').innerText =
		'Magasság: ' + (bomb.yVel * -1).toFixed(2)
		+ '\n Távolság: ' + bomb.xVel.toFixed(2)
		+ '\n Szél: ' + wind.toFixed(2)
		+ '\n Szélirány: ' + windDirection;
	ctx.beginPath();
	ctx.fillStyle = tank.color;
	ctx.arc(tank.x, tank.y, tank.r, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
}

function drawTank2() {
	ctx.beginPath();
	ctx.fillStyle = tank2.color;
	ctx.arc(tank2.x, tank2.y, tank2.r, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
}

function isCollide(a, b) {
	let distance = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	let distanceOld = Math.sqrt(Math.pow(a.oldX - b.x, 2) + Math.pow(a.oldY - b.y, 2));
	return (distance <= b.r + a.width/2) || (distanceOld <= b.r + a.width/2);
}

let yvelCopy;
let xvelCopy;
let bombsNum = 0;
function draw() {
	yvelCopy = bomb.yVel;
	xvelCopy = bomb.xVel;

	shoot();
}

function drawBarell() {
	ctx.beginPath();
	ctx.moveTo(tank.x, tank.y);
	ctx.lineTo(windDirection == 'bal' ? bomb.x + bomb.xVel - wind : bomb.x + bomb.xVel + wind, bomb.y + bomb.yVel);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

function drawObjects() {
	ctx.clearRect(0, 0, c.width, c.height);
	drawBarell();
	drawTank();
	drawTank2();
}

function afterShoot() {
	bombsNum++;
	bomb.yVel = yvelCopy;
	bomb.xVel = xvelCopy;
	wind = Math.random();
	windDirection = Math.random() > 0.5 ? 'bal' : 'jobb';
	document.getElementById('bombout').innerText =
		'Magasság: ' + (bomb.yVel * -1).toFixed(2)
		+ '\n Távolság: ' + bomb.xVel.toFixed(2)
		+ '\n Szél: ' + wind.toFixed(2)
		+ '\n Szélirány: ' + windDirection;
	drawObjects();
}

function shoot() {
	bomb.x += bomb.xVel;
	bomb.y += bomb.yVel;
	bomb.yVel += bomb.g;
	bomb.xVel = windDirection == 'bal' ? bomb.xVel - wind * 0.1 : bomb.xVel + wind * 0.1;
	ctx.beginPath();
	ctx.moveTo(bomb.oldX, bomb.oldY);
	ctx.lineTo(bomb.x, bomb.y);
	ctx.lineWidth = bomb.width;
	ctx.strokeStyle = tank.color;
	ctx.stroke();
	bomb.oldX = bomb.x;
	bomb.oldY = bomb.y;

	if (isCollide(bomb, tank2)) {
		alert('hit');
	} else if (bomb.y > c.height + 100) {
		cancelAnimationFrame(animFrameId);
		animFrameId = undefined;
		bomb.x = tank.x;
		bomb.y = tank.y;
		bomb.oldX = tank.x;
		bomb.oldY = tank.y;
		bomb.yVel = yvelCopy;
		afterShoot();
	} else {
		animFrameId = requestAnimationFrame(shoot);
	}
}

drawTank();
drawTank2();
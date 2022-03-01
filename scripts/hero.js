let keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.code] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.code];
}, false);

const mouse = {
	x: undefined,
	y: undefined
}
addEventListener("mousemove", e => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

class Hero {
    constructor(name, positionX, positionY, width, height) {
        this.name = name;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = 100;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = "../resources/hero.svg";
    }

    draw() {
        rotate = Math.atan2(mouse.y - this.positionY, mouse.x - this.positionX) + Math.PI / 2;
        context.beginPath();
        context.save();
        context.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
        context.rotate(rotate);
        context.translate(-this.positionX + -this.width / 2, -this.positionY + -this.height / 2);
        context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
        context.restore();
    }

    step(modifier) {
        const velocity = this.speed * modifier;
        if ('KeyW' in keysDown) {
            this.positionY -= velocity;
        }
        if ('KeyA' in keysDown) {
            this.positionX -= velocity;
        }
        if ('KeyS' in keysDown) {
            this.positionY += velocity;
        }
        if ('KeyD' in keysDown) {
            this.positionX += velocity;
        }

        if (this.positionY < 0) {
            this.positionY = 0;
        }
        if (this.positionX < 0) {
            this.positionX = 0;
        }
        if (this.positionY + this.height > canvas.height) {
            this.positionY = canvas.height - this.height;
        }
        if (this.positionX + this.width > canvas.width) {
            this.positionX = canvas.width - this.width;
        }
    }
}
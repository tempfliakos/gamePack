class Projectile {
	constructor(positionX, positionY, width, height, destination, damage, src) {
		this.positionX = positionX;
		this.positionY = positionY;
		this.speed = 1000;
		this.width = width;
		this.height = height;
		this.destination = destination;
		this.damage = damage;
		this.image = new Image();
		this.image.src = src;
	}

	draw() {
		context.beginPath();
		context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
	}

	step(modifier) {
		const velocity = this.speed * modifier;
		this.positionX += (this.destination.x * velocity);
		this.positionY += this.destination.y * velocity;
		this.draw();
	}
}
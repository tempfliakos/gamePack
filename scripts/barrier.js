class Barrier {
    constructor(positionX, positionY, width, height, image = barrierImage) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = image;
    }

    draw() {
        context.beginPath();
		context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
		context.closePath();
    }
}
import Canvas from "../../motor/Canvas";
import Square from "../../motor/Shape/Square";

export default class Start extends Square {
    private velocityX: number
    private velocityY: number
    private maxExcedation = 2000
    private minExcedation = 1500
    private sum = 6
    private multiplayer = 0.5

    constructor() {
        super({
            width: 30, height: 30, x: 0, y: 0,
            paintPriority: -1,
            frame: { textureId: "start", index: 1, frameSize: 30 }
        })

        this.setX(this.getRandomNumber(Canvas.getCanvas().width / 2, Canvas.getCanvas().width))
        this.setY(-this.getHeight())
        this.velocityX = this.getRandomNumber(4, 10)
        this.velocityY = this.getRandomNumber(2, 10)
    }

    public getRandomNumber(base: number, limit: number) {
        return Math.floor(Math.random() * (limit - base) + base)
    }

    update(): void {
        if (this.getX() + this.getWidth() + this.maxExcedation < 0 || this.getY() - this.getHeight() - this.maxExcedation > Canvas.getCanvas().height) {
            this.setX(this.getRandomNumber(Canvas.getCanvas().width / 2, Canvas.getCanvas().width))
            this.setY(-this.getHeight())

            this.velocityX = this.getRandomNumber(4, 10)
            this.velocityY = this.getRandomNumber(2, 10)
        }

        this.setFrameProperty("spin", (this.getFrameProperty("spin")! + 4) % 360)
        this.addX(-this.velocityX)
        this.addY(this.velocityY)
    }

    paint(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = 0.4
        this.paintFrame(ctx)

        const x = this.getX()
        const y = this.getY()
        const radius = this.getWidth() / 2

        const gradientRadius = radius + 5 + this.sum;

        const gradient = ctx.createRadialGradient(
            x + radius, y + radius, 0,
            x + radius, y + radius, gradientRadius
        );

        gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');


        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius + 5 + this.sum, 0, Math.PI * 2);
        ctx.fill();

        if (this.sum <= 5 || this.sum >= 20) {
            this.multiplayer *= -1
        }

        this.sum += this.multiplayer
    }
}
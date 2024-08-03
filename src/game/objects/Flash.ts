import Canvas from "../../motor/Canvas";
import Item from "../../motor/Items/Item";
import Square from "../../motor/Shape/Square";
import game from "../game";

export default class Flash extends Item {
    private radius = 5
    private sum = 10
    private onFinish: any

    shouldPaint(): boolean {
        return true
    }

    constructor(onFinish: any) {
        super({
            width: 30, height: 30, x: Canvas.getCanvas().width / 2, y: Canvas.getCanvas().height / 2,
            paintPriority: 100
        })

        this.onFinish = onFinish
    }

    update(): void {
        console.log(this.radius, Canvas.getCanvas().width)
        this.radius += this.sum

        if((this.radius) >= Canvas.getCanvas().width) {
            this.sum = -Math.abs(this.sum)
        }

        if(this.radius < 0) {
            game.remove(this)
            this.onFinish()
        }
    }

    paint(ctx: CanvasRenderingContext2D): void {
        const x = this.getX()
        const y = this.getY()
        const radius = this.radius / 2

        const gradientRadius = radius;

        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, gradientRadius
        );

        gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');


        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
import Canvas from "../../../motor/Canvas";
import Item from "../../../motor/Items/Item";
import Square from "../../../motor/Shape/Square";
import game from "../../game";

class Flash extends Item {
    private radius = 5
    private sum = 130
    private enabled = false
    private onEnd?: () => void
    private onHalf?: () => void

    shouldPaint(): boolean {
        return this.enabled
    }

    public automaticRemove(): boolean {
        return false
    }

    constructor() {
        super({
            width: 30, height: 30, x: 0, y: 0,
            paintPriority: 100
        })
    }

    public setOnHalf(onHalf: () => void) {
        this.onHalf = onHalf
    }

    public start() {
        if(this.enabled) return;

        this.setX(Canvas.getCanvas().width / 2)
        this.setY(Canvas.getCanvas().height / 2)
        this.radius = 5
        this.sum = 130

        this.enabled = true
    }

    update(): void {
        if(!this.enabled) return;

        this.radius += this.sum

        if(this.radius >= Canvas.getCanvas().width * 1.5) {
            this.sum = -Math.abs(this.sum)
            this.onHalf && this.onHalf()
        }

        if(this.radius < 0) {
            this.enabled = false
            this.onEnd && this.onEnd()
        }
    }

    paint(ctx: CanvasRenderingContext2D): void {
        const x = Canvas.getCanvas().width / 2
        const y = Canvas.getCanvas().height / 2
        const radius = this.radius / 2

        const gradientRadius = radius;

        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, gradientRadius
        );

        gradient.addColorStop(0.1, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');


        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default new Flash()
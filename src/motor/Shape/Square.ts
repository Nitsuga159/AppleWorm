import Canvas from "../Canvas";
import Gravity from "../Functions/Gravity/Gravity";
import Item from "../Items/Item";
import Transition from "../Items/Transition";
import Loop from "../Loop";

export default class Square extends Item {
    public static readonly DEFAULT_FILL = "#000"

    private transitionY: Transition | null =  null
    private transitionX: Transition | null =  null

    public isMoving() {
        return this.transitionX !== null || this.transitionY !== null
    }

    public setTransitionX(x: number) {
        this.transitionX = 
            new Transition({
                frames: 10,
                from: this.getX(),
                to: x,
                cb: (v) => super.addX(v),
                onEnd: () => {
                    (this.getFunctionalities()[0] as Gravity).setIsEnabled(true)
                    this.transitionX = null
                }
            })
    }

    public setTransitionY(y: number) {
        this.transitionY = 
            new Transition({
                frames: 10,
                from: this.getY(),
                to: y,
                cb: (v) => super.addY(v),
                onEnd: () => {
                    (this.getFunctionalities()[0] as Gravity).setIsEnabled(true)
                    this.transitionY = null
                }
            })
        
    }

    public getTransitionX() {
        return this.transitionX
    }

    public getTransitionY() {
        return this.transitionY
    }

    update() {

    }

    paint(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.fill || Square.DEFAULT_FILL
        ctx.fillRect(...this.getBounds())

        ctx.strokeStyle = "white"
        const [x, y, w, h] = this.getBounds()
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + w, y)
        ctx.lineTo(x + w, y + h)
        ctx.lineTo(x, y + h)
        ctx.closePath()
        ctx.stroke()
    }

    shouldPaint(): boolean {
        const [canvasWidth, canvasHeight] = Canvas.getSize()
        const [x, y] = this.getLocation()

        return true
    }

    copy() {
        const [x, y, width, height] = this.getBounds()
        return new Square({ fill: this.fill, x, y, width, height })
    }
}
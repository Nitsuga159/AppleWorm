import TreeElement, { ITreeElement } from "./TreeElement";

export default class Container extends TreeElement {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    constructor(data: ITreeElement) {
        super(data)

        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")!

        this.canvas.width = data.width
        this.canvas.height = data.height
    }

    public update(): void {
        this.getChilds().forEach(child => child.update())
    }

    public paint(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(...this.getBounds())

        this.fillSquareBorderRadius(this.ctx)
        this.ctx.fillStyle = this.getFill()!
        this.ctx.fill()

        this.getChilds().forEach(child => child.paint(this.ctx))

        ctx.beginPath()
        ctx.moveTo(10, 10 * 10)
        ctx.lineTo(20 * 10, 20  * 10)
        ctx.lineTo(10, 30  * 10)
        ctx.closePath()
        ctx.fillStyle = "black"
        ctx.fill()

        ctx.drawImage(this.canvas, this.getX(), this.getY())
    }
}
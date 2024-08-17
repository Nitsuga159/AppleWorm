import Transition from "../Items/Transition";
import TreeElement from "./TreeElement";

export default class Button extends TreeElement {
    private transition1?: Transition
    private transition2?: Transition
    private isInside: boolean = false
    private blur = 0
    
    public update(): void {
        this.transition1?.update()
        this.transition2?.update()
    }

    public getIsInside() {
        return this.isInside
    }
    
    public paint(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = this.getOpacity()
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = this.blur
        ctx.shadowColor = "gray"

        this.fillSquareBorderRadius(ctx)

        ctx.fillStyle = this.getFill()!
        ctx.strokeStyle = "red"
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.font  = "40px Arial"
        const textMetrics = ctx.measureText("hola")
        ctx.fillText("hola", this.getX() + (this.getWidth() / 2) -  (textMetrics.width / 2), this.getY()  + (this.getHeight() / 2) + ((textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent) / 2))
    }

    public onClick() {
        if (this.transition1) return;

        const y = this.getY()

        this.transition1 = new Transition({
            frames: 20,
            from: y,
            to: y + 10,
            cb: (v, p) => {
                if (p < 0.5) {
                    this.setOpacity(1 - p)
                    this.addY(v)
                } else {
                    this.setOpacity(p)
                    this.addY(-v)
                }
            },
            onEnd: () => {
                this.setY(y)
                this.setOpacity(1)
                this.transition1 = undefined
            }
        })
    }

    public onMouseEnter() {
        if(this.isInside) return

        this.transition2 = new Transition({
            frames: 20,
            from: 0,
            to: 40,
            cb: (v, p) => {
                this.blur += v
            },
            onEnd: () => {
                this.blur = 40
                this.transition2 = undefined
            }
        })

        this.isInside = true
    }

    public onMouseLeave() {
        if(!this.isInside) return

        this.transition2 = new Transition({
            frames: 20,
            from: 0,
            to: 40,
            cb: (v, p) => {
                this.blur -= v
            },
            onEnd: () => {
                this.blur = 0
                this.transition2 = undefined
            }
        })

        this.isInside = false
    }
}
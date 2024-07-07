import Canvas from "../Canvas";
import Gravity from "../Functions/Gravity/Gravity";
import Item from "../Items/Item";
import Transition from "../Items/Transition";
import Loop from "../Loop";

export default class Square extends Item {
    public static readonly DEFAULT_FILL = "#000"

    update() {

    }

    paint(ctx: CanvasRenderingContext2D): void {
        if(this.getFrameProperty("textureId")) {
            this.paintFrame(ctx)
        } else {
            ctx.fillStyle = this.fill || Square.DEFAULT_FILL
            ctx.fillRect(...this.getBounds())
        }

        if(this.isDebug()) {
            ctx.strokeStyle = "red"
            ctx.lineWidth = 4
            const [x, y, w, h] = this.getBounds()
            ctx.beginPath()
            ctx.moveTo(x + 2, y + 2)
            ctx.lineTo(x + w - 2, y + 2)
            ctx.lineTo(x + w - 2, y + h - 2)
            ctx.lineTo(x + 2, y + h - 2)
            ctx.closePath()
            ctx.stroke()
        }
    }

    shouldPaint(): boolean {
        const [canvasWidth, canvasHeight] = Canvas.getSize()
        const [x, y, width, height] = this.getBounds()

        return (x + width) >= 0 && x <= canvasWidth && (y + height) >= 0 && y <= canvasHeight
    }
}
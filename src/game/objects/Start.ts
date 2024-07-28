import Canvas from "../../motor/Canvas";
import Item from "../../motor/Items/Item";

export default class Start extends Item {
    constructor() {
        super({ 
            width: 30, height: 30, x: Canvas.getCanvas().width + 30, y: -30,
            paintPriority: -1,
            frame: { textureId: "start", index: 1, frameSize: 30 }
        })
    }

    update(): void {
        this.setFrameProperty("spin", (this.getFrameProperty("spin")! + 4) % 360)
        this.addX(-2)
        this.addY(1)
    }

    paint(ctx: CanvasRenderingContext2D): void {
        this.paintFrame(ctx)
    }

    shouldPaint(): boolean {
        return true
    }
}
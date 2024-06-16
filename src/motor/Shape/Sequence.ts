import Function from "../Functions/Function";
import Item from "../Items/Item";

export default class Sequence extends Item {
    private sequence: Item[] = []

    public add(item: Item) {
        this.sequence.push(item)
    }

    
    
    update(): void {
        this.sequence.forEach(i => i.update())
    }

    paint(ctx: CanvasRenderingContext2D): void {
        this.sequence.forEach(i => i.shouldPaint() && i.paint(ctx))
    }

    shouldPaint(): boolean {
        return true
    }
}
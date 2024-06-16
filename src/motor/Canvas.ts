export default class Canvas {
    private static canvas: HTMLCanvasElement
    private static ctx: CanvasRenderingContext2D

    public static init({ id, width, height }: { id: string, width: number, height: number }) {
        Canvas.canvas = (document.getElementById(id) as HTMLCanvasElement)

        if(!Canvas.canvas) {
            throw new Error("Canvas HTML Element not found")
        }

        Canvas.canvas.width = width
        Canvas.canvas.height = height

        Canvas.ctx = Canvas.canvas.getContext("2d")!
    }

    public static getSize(): [number, number] {
        return [ Canvas.canvas.width, Canvas.canvas.height ]
    }

    public static getCanvas() {
        return Canvas.canvas
    }

    public static getCtx() {
        return Canvas.ctx;
    }
}
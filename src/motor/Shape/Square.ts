import Canvas from "../Canvas";
import Gravity from "../Functions/Gravity/Gravity";
import Item from "../Items/Item";
import Transition from "../Items/Transition";
import Loop from "../Loop";

export default class Square extends Item {
    public static readonly DEFAULT_FILL = "#000"

    protected transitionY: Transition | null = null
    protected transitionX: Transition | null = null

    public isMoving() {
        return this.transitionX !== null || this.transitionY !== null
    }

    public setTransitionX(x: number, cb?: () => void) {
        this.transitionX =
            new Transition({
                frames: 10,
                from: this.getX(),
                to: x,
                cb: (v) => super.addX(v),
                onEnd: () => {
                    (this.getFunctionalities()[0] as Gravity).setIsEnabled(true)
                    this.transitionX = null
                    cb && cb()
                }
            })
    }

    public setTransitionY(y: number, cb?: () => void) {
        this.transitionY =
            new Transition({
                frames: 10,
                from: this.getY(),
                to: y,
                cb: (v) => super.addY(v),
                onEnd: () => {
                    (this.getFunctionalities()[0] as Gravity).setIsEnabled(true)
                    this.transitionY = null
                    cb && cb()
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
        const texture = this.getTexture()
        if (texture) {
            if (this.getFrame() !== undefined) {
                const { size, spin, flip, delX = 0, delY = 0 } = this.getFrame()!;
                const dx = this.getX();
                const dy = this.getY();
                const doFlip = flip;
                const angle = spin ? spin * Math.PI / 180 : 0;  // Convertir grados a radianes

                // Guardar el contexto actual
                ctx.save();

                // Trasladar el contexto al punto donde queremos dibujar la imagen
                ctx.translate((dx + size / 2) + delX, (dy + size / 2) + delY);

                // Aplicar rotación si está definida
                if (angle) {
                    ctx.rotate(angle);
                }

                // Aplicar flip horizontal si está habilitado
                if (doFlip) {
                    ctx.scale(-1, 1);
                }

                const { x, y } = this.getFrameCoordinates()!

                // Dibujar la parte de la imagen extraída
                ctx.drawImage(texture, x, y, size, size, -size / 2, -size / 2, size, size);

                ctx.restore()
            } else {
                ctx.drawImage(texture, this.getX(), this.getY())
            }
        } else {
            ctx.fillStyle = this.fill || Square.DEFAULT_FILL
            ctx.fillRect(...this.getBounds())
        }

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
}
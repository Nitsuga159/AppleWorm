import Base from "./Base"
import Canvas from "./Canvas"
import Container from "./Container"
import Item from "./Items/Item"

export default class Loop extends Base {
    constructor() {
        super()

        Loop.instances.push(this)
    }

    private readonly container = new Container()
    private static instances: Loop[] = []

    public execute(cb: (loop: Loop) => void) {
        const ctx = Canvas.getCtx()
        const canvas = Canvas.getCanvas()

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.container.getItems().sort((i1, i2) => i1.getY() < i2.getY() ? -1 : 1)

        this.container.getItems()
            .filter(f => f.shouldPaint())
            .forEach(item => {
                item.getFunctionalities().forEach(f => f.isEnabled() && f.applicate(item, this))
                item.update()
            })
            
            cb(this)
            
            this.container.getItems()
            .filter(f => f.shouldPaint())
            .forEach(item => {
                ctx.save()
                item.paint(ctx)
                ctx.restore()
            })

        requestAnimationFrame(() => this.execute.call(this, cb))
    }

    public forEachTarget(target: number, callback: (item: Item, index: number) => void) {
        this.container.getItems().forEach((item, index) => {
            if ((item.getGroup() & target) !== 0) {
                callback(item, index)
            }
        })
    }

    public getContainer() {
        return this.container
    }

    public static getLoops() {
        return Loop.instances
    }
}
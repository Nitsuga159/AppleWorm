import Canvas from "./Canvas"
import Container from "./Container"
import Item from "./Items/Item"

export default class Loop extends Container {
    private sky: HTMLImageElement = document.getElementById("sky") as HTMLImageElement

    constructor() {
        super()

        Loop.instances.push(this)
    }

    private static instances: Loop[] = []

    public execute(cb: (loop: Loop) => void) {
        const ctx = Canvas.getCtx()
        const canvas = Canvas.getCanvas()

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.get().sort((i1, i2) => i1.getY() < i2.getY() ? -1 : 1)

        this.get()
            .filter(f => f.shouldPaint())
            .forEach(item => {
                item.getFunctionalities().forEach(f => f.isEnabled() && f.applicate(item, this))
                item.update()
            })
            
            cb(this)
            
            this.get()
            .filter(f => f.shouldPaint())
            .slice()
            .sort((a, b) => a.getPaintPriority() < b.getPaintPriority() ? -1 : 1)
            .forEach(item => {
                ctx.save()
                item.paint(ctx)
                ctx.restore()
            })

        requestAnimationFrame(() => this.execute.call(this, cb))
    }

    public forEachItemConstructor(target: (typeof Item)[], callback: ({ item, stop }: {item: Item, stop: () => void}) => void): void {
        let stopLoop = false
        for(let itemConstructor of target) {
            for(let item of itemConstructor.getAllItems() || []) {
                callback({ item, stop: () => stopLoop = true })
            }
            if(stopLoop) {
                break
            }
        }
    }

    public static getLoops() {
        return Loop.instances
    }
}
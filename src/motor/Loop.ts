import { Class } from "../game/interfaces/Class"
import Canvas from "./Canvas"
import Container from "./Container"
import Item from "./Items/Item"

export default class Loop extends Container {
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
            .forEach(item => {
                item.getFunctionalities().forEach(f => f.isEnabled() && f.applicate(item, this))
                item.update()
            })
            
            cb(this)
            
            this.get()
            .filter(f => f.shouldPaint())
            .slice()
            .forEach(item => {
                ctx.save()
                item.paint(ctx)
                ctx.restore()
            })

        requestAnimationFrame(() => this.execute.call(this, cb))
    }

    public forEachItemConstructor(target: Class<Item>[], callback: (item: Item) => boolean | void): void {
        for(let itemConstructor of target) {
            for(let item of (itemConstructor as unknown as typeof Item).getAllItems() || []) {
                if(callback(item)) {
                    return;
                }
            }
        }
    }

    public static getLoops() {
        return Loop.instances
    }
}
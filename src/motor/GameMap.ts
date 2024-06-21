import Item from "./Items/Item";
import Loop from "./Loop";

export default class GameMap extends Loop {
    private itemConstructors: (typeof Item)[] = []

    constructor() {
        super()
    }

    public loadItemConstructor(...constuctor: (typeof Item)[]) {
        this.itemConstructors.push(...constuctor)

        return this
    }

    public getItemConstructors() {
        return this.itemConstructors.slice()
    }

    public reset() {
        super.reset()

        this.itemConstructors.forEach(
            constructor => constructor.resetAllItems()
        )

        return this
    }
}
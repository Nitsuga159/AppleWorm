import { Class } from "../game/interfaces/Class";
import Item from "./Items/Item";
import Loop from "./Loop";

export default class GameMap extends Loop {
    private itemConstructors: Class<Item>[] = []

    public loadItemConstructor(...constuctor: Class<Item>[]) {
        this.itemConstructors.push(...constuctor)

        return this
    }

    public getItemConstructors() {
        return this.itemConstructors.slice()
    }

    public reset() {
        this.itemConstructors.forEach(
            constructor => (constructor as unknown as typeof Item).resetAllItems()
        )

        return this
    }
}
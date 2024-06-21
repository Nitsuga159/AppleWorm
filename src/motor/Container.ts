import Item from "./Items/Item";

export default class Container {
    private items: Item[] = []

    public get() {
        return this.items
    }

    public add(item: Item) {
        this.items.push(item)
    }

    public remove(item: Item) {
        this.items = this.items.filter(i => i !== item);
        (item.constructor as typeof Item).removeItem(item)
    }

    public reset() {
        this.items = []
    }
}
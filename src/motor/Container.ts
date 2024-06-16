import Item from "./Items/Item";

export default class Container {
    private items: Item[] = []

    public getItems() {
        return this.items
    }

    public addItem(item: Item) {
        this.items.push(item)
    }

    public removeItem(item: Item) {
        this.items = this.items.filter(i => i !== item)
    }
}
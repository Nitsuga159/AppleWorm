import { DIRECTION } from "../../Items/DefaultCollisions";
import Item from "../../Items/Item";
import Loop from "../../Loop";
import Function from "../Function";
import { IGravity } from "./IGravity";

export default class Gravity extends Function {
    private velocity: number
    

    constructor({ velocity }: IGravity) {
        super()

        this.velocity = velocity
    }

    public applicate(item: Item, loop: Loop): void {
        item.setY(item.getY() + this.velocity)
    }

    public setVelocity(velocity: number) {
        this.velocity = velocity
    }
}
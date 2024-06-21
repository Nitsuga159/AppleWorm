import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import Worm from "./Worm";
import CONFIG from "./constants";

export interface IApple extends Omit<IItem, "target" | "group" | "width" | "height"> {

}

export default class Apple extends Square {
    constructor(data: IApple) {
        super({ ...data, textureId: "apple", width: CONFIG.SIZE, height: CONFIG.SIZE, group: [Apple] })

        this.fill = "red"
    }

    public canEat(worm: Worm) {
        const head = worm.getHead()

        return this.matchLocation(head)
    }
}
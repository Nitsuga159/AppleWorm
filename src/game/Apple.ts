import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import Worm from "./Worm";
import loop from "./loop";

export interface IApple extends Omit<IItem, "target" | "group"> {

}

export default class Apple extends Square {
    public static readonly GROUP = loop.getNextGroup()
    private image = new Image()

    constructor(data: IApple) {
        super({ ...data, group: Apple.GROUP})

        this.image.src = "../../apple.png"
    }

    public canEat(worm: Worm) {
        const head = worm.getHead()

        return this.matchLocation(head)
    }

    public paint(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.getX() - 2, this.getY() - 2)
    }
}
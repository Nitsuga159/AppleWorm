import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import loop from "./loop";

export interface IBlock extends Omit<IItem, "target" | "group"> {

}

export default class Block extends Square {
    public static readonly GROUP = loop.getNextGroup()
    private image = new Image()


    constructor(data: IBlock) {
        super({ ...data, group: Block.GROUP })

        this.image.src = "../../block-union.png"
    }

    public paint(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.getX() - 4, this.getY() - 4)
     }
}
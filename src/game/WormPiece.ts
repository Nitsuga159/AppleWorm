import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import Apple from "./Apple";
import Block from "./Block";
import Stone from "./Stone";
import loop from "./loop";

export interface IWormPiece extends Omit<IItem, "target" | "group"> {

}

export default class WormPiece extends Square {
    public static readonly GROUP = loop.getNextGroup()
    private image = new Image()

    constructor(data: IWormPiece) {
        super({ ...data, group: WormPiece.GROUP, target: Stone.GROUP | Block.GROUP | Apple.GROUP })

        this.image.src = "../../worm.png"
    }

    public paint(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.getX() - 4, this.getY() - 4)
    }

    public copy(): WormPiece {
        return super.copy().setGroup(WormPiece.GROUP).setTarget(Stone.GROUP | Block.GROUP | Apple.GROUP) as WormPiece
    }
}
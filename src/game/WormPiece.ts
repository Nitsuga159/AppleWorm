import game from "./game";
import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import Apple from "./Apple";
import Block from "./Block";
import Stone from "./Stone";
import CONFIG from "./constants";
import Transition from "../motor/Items/Transition";
import Gravity from "../motor/Functions/Gravity/Gravity";

export interface IWormPiece extends Omit<IItem, "target" | "group" | "width" | "height"> {

}

export default class WormPiece extends Square {
    constructor(data: IWormPiece) {
        super({ ...data, paintPriority: 9, width: CONFIG.SIZE, height: CONFIG.SIZE, textureId: "worm", group: [WormPiece], target: [Stone, Block, Apple] })
    }

    public copy(): WormPiece {
        return new WormPiece({ x: this.getX(), y: this.getY() }).setGroup([WormPiece]).setTarget([Stone, Block, Apple])
    }
}
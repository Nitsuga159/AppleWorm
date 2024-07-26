import { IItem } from "../../motor/Items/IItem";
import Square from "../../motor/Shape/Square";
import BaseObject from "./BaseObject";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import GameMap from "../../motor/GameMap";
import WormPiece from "./WormPiece";

export default class Block extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({ 
            ...data, 
            width: CONFIG.SIZE, 
            height: CONFIG.SIZE, 
            paintPriority: 10,
            frame: { index, textureId: "block", columns: 6, rows: 5, frameSize: 50, spin },
            group: [Block] 
        })

        this.fill = "#420"
    }

    public onCollide(_: WormPiece, __: GameMap): boolean {
        return false
    }
}
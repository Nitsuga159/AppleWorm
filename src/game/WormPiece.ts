import game from "./game";
import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import Apple from "./Apple";
import Block from "./Block";
import Stone from "./Stone";
import CONFIG from "./constants";
import { IPSeudoItem } from "./interfaces/IPseudoItem";
import Hole from "./Hole";
import BaseObject from "./BaseObject";

export default class WormPiece extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({ 
            ...data, 
            paintPriority: 7, 
            width: CONFIG.SIZE, 
            height: CONFIG.SIZE,  
            frame: { index, textureId: "worm", columns: 2, frameSize: 55, spin },
            group: [WormPiece], 
            target: [Stone, Block, Apple, Hole] 
        })
    }

    public update(): void {
        
    }

    public copy(): WormPiece {
        return new WormPiece({ 
            x: this.getX(), 
            y: this.getY(),
            index: this.getFrameProperty("index"),
            spin: this.getFrameProperty("spin")
        })
    }
}
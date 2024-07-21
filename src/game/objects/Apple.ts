import { IItem } from "../../motor/Items/IItem";
import Square from "../../motor/Shape/Square";
import BaseObject from "./BaseObject";
import Worm from "../Worm";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";

export default class Apple extends BaseObject {
    constructor({ index, spin, ...data}: IPSeudoItem) {
        super({ 
            ...data, 
            width: CONFIG.SIZE, 
            height: CONFIG.SIZE, 
            paintPriority: 6,
            frame: { index, textureId: "apple",  columns: 1, frameSize: 55, delX: -2, delY: -2, spin },
            group: [Apple] 
        })

        this.fill = "red"
    }

    public canEat(worm: Worm) {
        const head = worm.getHead()

        return this.matchLocation(head)
    }
}
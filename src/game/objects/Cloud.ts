import { IItem } from "../../motor/Items/IItem";
import Square from "../../motor/Shape/Square";
import Worm from "../Worm";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";

export default class Cloud extends Square {
    constructor({ index, ...data}: IPSeudoItem) {
        super({ 
            ...data, 
            width: CONFIG.SIZE, 
            height: CONFIG.SIZE, 
            paintPriority: -1,
            frame: { index, textureId: "cloud",  columns: 1, frameSize: 100 },
        })

        this.fill = "red"
    }
}
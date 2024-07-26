import { IItem } from "../../motor/Items/IItem";
import Square from "../../motor/Shape/Square";
import Worm from "../Worm";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";

export default class Cloud extends Square {
    constructor({ index, ...data}: IPSeudoItem) {
        super({ 
            ...data, 
            width: 300, 
            height: 300, 
            paintPriority: -1,
            frame: { index, textureId: "cloud",  columns: 1, frameSize: 300 },
        })

        this.fill = "red"
    }
}
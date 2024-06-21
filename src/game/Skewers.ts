import BaseItem from "../motor/Items/BaseItem";
import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import Worm from "./Worm";
import CONFIG from "./constants";

export interface ISkewers extends Omit<IItem, "target" | "group" | "width" | "height"> {}

export default class Skewers extends Square {

    constructor(data: ISkewers) {
        super({ ...data, paintPriority: 10, textureId: "skewers", width: CONFIG.SIZE, height: CONFIG.SIZE, group: [Skewers] })

        this.fill = "orange"
    }

    public static checkCollision(worm: Worm) {
        Skewers.getAllItems()?.forEach((skewers) => {
            skewers = skewers as Skewers
            if(worm.getPieces().some(piece => BaseItem.matchLocation(skewers.getLocation(), piece.getLocation()))) {
                
                window.location.reload()
            }
        })
    }
}
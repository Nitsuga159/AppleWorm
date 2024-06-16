import { IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import Worm from "./Worm";
import WormPiece from "./WormPiece";
import loop from "./loop";

export interface ISkewers extends Omit<IItem, "target" | "group"> {}

export default class Skewers extends Square {
    public static readonly GROUP = loop.getNextGroup()

    constructor(data: ISkewers) {
        super({ ...data, group: Skewers.GROUP })
    }

    public static checkCollision(worm: Worm) {
        loop.forEachTarget(Skewers.GROUP, (skewers) => {
            skewers = skewers as Skewers

            if(worm.getPieces().some(pice => pice.matchLocation(skewers))) {
                window.location.reload()
            }
        })
    }
}
import BaseItem from "../../motor/Items/BaseItem";
import { IItem } from "../../motor/Items/IItem";
import Item from "../../motor/Items/Item";
import Square from "../../motor/Shape/Square";
import BaseObject from "./BaseObject";
import Worm from "../Worm";
import CONFIG from "../constants";
import game from "../game";
import { IPSeudoItem } from "../interfaces/IPseudoItem";

export default class Skewers extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({
            ...data,
            paintPriority:99,
            width: CONFIG.SIZE,
            height: CONFIG.SIZE,
            frame: { index, textureId: "skewers", columns: 1, frameSize: 50, spin },
            group: [Skewers]
        })

        this.checkSpin()

        this.fill = "orange"
    }

    public rotate(): void {
        super.rotate()

        this.checkSpin()
    }

    private checkSpin() {
        const spin = this.getFrameProperty("spin")
        if (spin === 90) {
            this.setFrameProperty("delX", -10)
            this.setFrameProperty("delY", 3)
        } else if (spin === 180) {
            this.setFrameProperty("delX", 0)
            this.setFrameProperty("delY", 0)
        } else if (spin === 270) {
            this.setFrameProperty("delX", 0)
            this.setFrameProperty("delY", 3)
        } else {
            this.setFrameProperty("delX", 0)
            this.setFrameProperty("delY", 10)
        }
    }

    public static checkCollision(worm?: Worm) {
        Skewers.getAllItems().forEach((skewers) => {
            skewers = skewers as Skewers
            if (worm?.getPieces()?.some(piece => BaseItem.matchLocation(skewers.getLocation(), piece.getLocation()))) {

                game.setStop(true)
            }
        })
    }
}
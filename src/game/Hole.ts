import Square from "../motor/Shape/Square";
import BaseObject from "./BaseObject";
import CONFIG from "./constants";
import game from "./game";
import { IPSeudoItem } from "./interfaces/IPseudoItem";

export default class Hole extends BaseObject {

    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({
            ...data,
            width: CONFIG.SIZE,
            height: CONFIG.SIZE,
            paintPriority: 10,
            frame: { index, textureId: "hole", columns: 1, totalFrames: 1, frameSize: 60, delX: -5, delY: -5, spin },
            group: [Hole]
        })

        this.fill = "black"
    }

    public update(): void {
        this.setFrameProperty(
            "spin",
            (this.getFrameProperty("spin")! + 10) % 360
        )
    }
}
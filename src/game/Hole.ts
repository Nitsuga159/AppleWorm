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

    public static won(newX: number, newY: number) {
        if(!game.getWorm()) return;
        const headCube = game.getWorm()!.getHead()
        const worm = game.getWorm()!
        const isHole = game.getFrom([headCube.getX() + newX, headCube.getY() + newY])

        if (isHole instanceof Hole) {
            worm.setFalling(false)
            worm.getPieces().forEach(p => p.setTarget(p.getTarget().filter(p => p !== Hole)))

            const reverseWorm = game.getWorm()!.getPieces().slice().reverse()

            reverseWorm.map((_, i) => reverseWorm.slice(i + 1).map(n => ({ x: n.getX(), y: n.getY() })))
                .forEach(
                    (p, i) => reverseWorm[i].setChainTransition(p)
                )
        }
    }
}
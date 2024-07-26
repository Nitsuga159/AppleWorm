import Square from "../../motor/Shape/Square";
import BaseObject from "./BaseObject";
import CONFIG from "../constants";
import game, { WormGame } from "../game";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import GameMap from "../../motor/GameMap";
import WormPiece from "./WormPiece";

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
            (this.getFrameProperty("spin")! - 10) % -360
        )
    }

    public onCollide(headCube: WormPiece, game: GameMap) {
        const gameWorm = game as WormGame
        const worm = gameWorm.getWorm()!
        const reverseWorm: BaseObject[] = gameWorm.getWorm()!.getPieces().slice().reverse()
        const holeCopy = this.copy()
        const holeCopy2 = this.copy()
        const addX = WormGame.floorCoord(this.getX() - headCube.getX())
        const addY = WormGame.floorCoord(this.getY() - headCube.getY())

        console.log(addX, addY)
        reverseWorm.push(
            this,
            holeCopy.setX(holeCopy.getX() + addX).setY(holeCopy.getY() + addY),
            holeCopy2.setX(holeCopy2.getX() + (addX * 2)).setY(holeCopy2.getY() + (addY * 2)),
        )

        gameWorm.setWonPiece(reverseWorm)

        reverseWorm.map((_, i) => reverseWorm.slice(i + 1).map(n => ({ x: n.getX(), y: n.getY() })))
            .forEach(
                (p, i) => reverseWorm[i].setChainTransition(p, () => {
                    worm.checkQueueFrame()
                    worm.checkEndFrame()
                })
            )

        worm.checkHeadFrame(
            [worm.getHead().getFrameProperty("frameX")!, worm.getHead().getFrameProperty("frameY")!],
            [worm.getHead().getNextX(), worm.getHead().getNextY()]
        )

        return true
    }
}
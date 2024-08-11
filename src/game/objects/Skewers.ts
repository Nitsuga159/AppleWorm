import BaseItem from "../../motor/Items/BaseItem";
import BaseObject from "./BaseObject";
import CONFIG from "../constants";
import game, { WormGame } from "../game";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import WormPiece from "./WormPiece";
import GameMap from "../../motor/GameMap";

export default class Skewers extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({
            ...data,
            paintPriority:99,
            width: CONFIG.SIZE,
            height: CONFIG.SIZE,
            canMove: true,
            canRotate: true,
            frame: { index, textureId: "skewers", columns: 1, frameSize: 50, spin },
            group: [Skewers]
        })

        this.setFrameBySpin()
    }

    public rotate(): void {
        super.rotate()

        this.setFrameBySpin()
    }

    private setFrameBySpin() {
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

    public onWormHeadCollide(headCube: WormPiece, game: GameMap) {
        (game as WormGame).setStop(true).getWorm()!.setFalling(false)

        //dead frame
        headCube.setFrameProperty("index", 5)

        return true
    }

    public static hasCollision() {
        for(let piece of game.getWorm()?.getPieces() || []) {
            for(let skewer of Skewers.getAllItems()) {
                if(BaseItem.matchLocation(WormGame.floorCoords(piece.getLocation()), WormGame.floorCoords(skewer.getLocation()))) {
                    game.setStop(true)
                    game.getWorm()!.getHead().setFrameProperty("index", 5)
                    return true
                }
            }
        }

        return false
    }
}
import BaseObject from "./BaseObject";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import { WormGame } from "../game";
import GameMap from "../../motor/GameMap";
import WormPiece from "./WormPiece";

export default class Apple extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({
            ...data,
            width: CONFIG.SIZE,
            height: CONFIG.SIZE,
            canMove: true,
            canRotate: false,
            paintPriority: 6,
            frame: { index, textureId: "apple", columns: 1, frameSize: 55, delX: -2, delY: -2, spin },
            group: [Apple]
        })
    }

    public onWormHeadCollide(_: WormPiece, game: GameMap): boolean {
        (game as WormGame).getWorm()!.enlarge()

        return true
    }
}
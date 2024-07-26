import { IItem } from "../../motor/Items/IItem";
import Square from "../../motor/Shape/Square";
import BaseObject from "./BaseObject";
import Worm from "../Worm";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import { ILocation } from "../../motor/Items/IBaseItem";
import BaseItem from "../../motor/Items/BaseItem";
import game, { WormGame } from "../game";
import GameMap from "../../motor/GameMap";
import WormPiece from "./WormPiece";

export default class Apple extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({
            ...data,
            width: CONFIG.SIZE,
            height: CONFIG.SIZE,
            paintPriority: 6,
            frame: { index, textureId: "apple", columns: 1, frameSize: 55, delX: -2, delY: -2, spin },
            group: [Apple]
        })

        this.fill = "red"
    }

    public onCollide(_: WormPiece, game: GameMap): boolean {
        (game as WormGame).getWorm()!.enlarge()

        return true
    }
}
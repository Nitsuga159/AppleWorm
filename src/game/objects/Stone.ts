import Gravity from "../../motor/Functions/Gravity/Gravity";
import { DIRECTION } from "../../motor/Items/DefaultCollisions";
import { IItem } from "../../motor/Items/IItem";
import Loop from "../../motor/Loop";
import Square from "../../motor/Shape/Square";
import Apple from "./Apple";
import BaseObject from "./BaseObject";
import Block from "./Block";
import Hole from "./Hole";
import WormPiece from "./WormPiece";
import CONFIG from "../constants";
import game, { WormGame } from "../game";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import GameMap from "../../motor/GameMap";
import Skewers from "./Skewers";

export default class Stone extends BaseObject {
    private gravity = new Gravity({ velocity: CONFIG.GRAVITY })
    private falling = false

    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({ 
            ...data, 
            paintPriority: 11, 
            width: CONFIG.SIZE, 
            height: CONFIG.SIZE, 
            frame: { index, textureId: "stone", columns: 1, frameSize: 55, spin },
            group: [Stone], 
            target: [WormPiece, Block, Apple, Stone, Hole] 
        })

        this.addFunctionality(this.gravity)

        this.fill = "gray"
        this.falling = false
    }

    public getGravity() {
        return this.gravity
    }

    public update(): void {
        super.update()

        this.falling = true
        game.forEachItemConstructor(
            this.getTarget(), item => {
                if(item !== this && this.itemCollision(this, item) === DIRECTION.TOP) {
                    this.setY(item.getY() - this.getHeight())
                    this.falling = false
                    return true
                }
            }
        )
    }

    public onCollide(headCube: WormPiece, game: GameMap): boolean {
        if(this.falling) return false;
        
        const gameWorm = game as WormGame
        const addX = WormGame.floorCoord(this.getX() - headCube.getX())
        const addY = WormGame.floorCoord(this.getY() - headCube.getY())

        const item = gameWorm.getFrom([this.getX() + addX, this.getY() + addY])
        if(item !== null && !(item instanceof Skewers)) return false;

        this.getGravity().setIsEnabled(false);
        if(addX) {
            this.setTransitionX(this.getX() + addX, false, () => this.getGravity().setIsEnabled(true));
        } else {
            this.setTransitionY(this.getY() + addY, false, () => this.getGravity().setIsEnabled(true)); 
        }

        this.falling = true

        return true
    }
}
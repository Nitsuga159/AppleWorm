import Gravity from "../../motor/Functions/Gravity/Gravity";
import { DIRECTION } from "../../motor/Items/DefaultCollisions";
import Apple from "./Apple";
import BaseObject from "./BaseObject";
import Block from "./Block";
import Hole from "./Hole";
import WormPiece from "./WormPiece";
import CONFIG from "../constants";
import game, { WormGame } from "../game";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import GameMap from "../../motor/GameMap";

export default class Stone extends BaseObject {
    private readonly gravity = new Gravity({ velocity: CONFIG.GRAVITY })
    private falling = false

    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({ 
            ...data, 
            paintPriority: 11, 
            width: CONFIG.SIZE, 
            height: CONFIG.SIZE, 
            canMove: true,
            canRotate: false,
            frame: { index, textureId: "stone", columns: 1, frameSize: 55, spin },
            group: [Stone], 
            target: [WormPiece, Block, Apple, Stone, Hole] 
        })

        this.addFunctionality(this.gravity)
        this.falling = false
    }

    public getFalling() {
        return this.falling
    }

    public getGravity() {
        return this.gravity
    }

    public update(): void {
        super.update()

        this.falling = true
        
        //detects collision while falling
        game.forEachItemConstructor(
            this.getTarget(), item => {
                //collision with a lower item
                if(item !== this && this.itemCollision(this, item) === DIRECTION.TOP) {
                    this.setY(item.getY() - this.getHeight())
                    this.falling = false
                    return true
                }
            }
        )
    }

    public onWormHeadCollide(headCube: WormPiece, game: GameMap): boolean {
        if(this.falling) {
            return false;
        }
        
        const gameWorm = game as WormGame

        const [addX, addY] = WormGame.floorCoords(this.getDistance(headCube))

        const item = gameWorm.getFrom([this.getX() + addX, this.getY() + addY])
        
        if(this.getTarget().some(c => item instanceof c)) {
            return false
        }

        this.gravity.setIsEnabled(false);

        if(addX) {
            this.setTransitionX(this.getX() + addX, false, () => this.gravity.setIsEnabled(true));
        } else {
            this.setTransitionY(this.getY() + addY, false, () => this.gravity.setIsEnabled(true)); 
        }

        return true
    }
}
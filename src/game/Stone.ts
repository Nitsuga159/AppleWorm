import Gravity from "../motor/Functions/Gravity/Gravity";
import { DIRECTION } from "../motor/Items/DefaultCollisions";
import { IItem } from "../motor/Items/IItem";
import Loop from "../motor/Loop";
import Square from "../motor/Shape/Square";
import Apple from "./Apple";
import Block from "./Block";
import WormPiece from "./WormPiece";
import CONFIG from "./constants";
import game from "./game";

export interface IStone extends Omit<IItem, "group" | "target" | "width" | "height"> {
    
}

export default class Stone extends Square {
    private gravity = new Gravity({ velocity: CONFIG.GRAVITY })

    constructor(data: IStone) {
        super({ ...data, paintPriority: 8, textureId: "stone", width: CONFIG.SIZE, height: CONFIG.SIZE, group: [Stone], target: [WormPiece, Block, Apple] })

        this.addFunctionality(this.gravity)

        this.fill = "gray"
    }

    public getGravity() {
        return this.gravity
    }

    public update(): void {
        this.getTransitionX()?.update()
        this.getTransitionY()?.update()

        game.forEachItemConstructor(
            this.getTarget(), ({ item, stop }) => {
                if(this.itemCollision(this, item) === DIRECTION.TOP) {
                    this.setY(Math.floor(this.getY() / CONFIG.SIZE) * CONFIG.SIZE)
                    stop()
                }
            }
        )
    }
}
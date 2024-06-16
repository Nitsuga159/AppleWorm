import Gravity from "../motor/Functions/Gravity/Gravity";
import { DIRECTION } from "../motor/Items/DefaultCollisions";
import { IItem } from "../motor/Items/IItem";
import Loop from "../motor/Loop";
import Square from "../motor/Shape/Square";
import Block from "./Block";
import WormPiece from "./WormPiece";
import CONFIG from "./constants";
import loop from "./loop";

export interface IStone extends Omit<IItem, "group" | "target"> {
    
}

export default class Stone extends Square {
    public static readonly GROUP = loop.getNextGroup()
    private gravity = new Gravity({ velocity: CONFIG.GRAVITY })

    constructor(data: IStone) {
        super({ ...data, group: Stone.GROUP, target: WormPiece.GROUP | Block.GROUP })

        this.addFunctionality(this.gravity)
    }

    public getGravity() {
        return this.gravity
    }

    public update(): void {
        this.getTransitionX()?.update()
        this.getTransitionY()?.update()

        Loop.getLoops()[0].forEachTarget(this.getTarget(), (item) => {
            if(this.itemCollision(this, item) === DIRECTION.TOP) {
                this.setY(Math.round(this.getY() / CONFIG.SIZE) * CONFIG.SIZE)
            }
        })
    }
}
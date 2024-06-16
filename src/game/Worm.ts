import Gravity from "../motor/Functions/Gravity/Gravity";
import { DIRECTION } from "../motor/Items/DefaultCollisions";
import Item from "../motor/Items/Item";
import Loop from "../motor/Loop";
import Square from "../motor/Shape/Square";
import Block from "./Block";
import Stone from "./Stone";
import WormPiece from "./WormPiece";
import CONFIG from "./constants";
import loop from "./loop";

export default class Worm {
    private gravity = new Gravity({ velocity: CONFIG.GRAVITY })
    private pieces: WormPiece[]

    constructor(pieces: WormPiece[]) {
        pieces.forEach(p => p.addFunctionality(this.gravity))

        this.pieces = pieces
    }

    public isFalling() {
        return this.gravity.isEnabled()
    }
 
    private onCollide() {
        this.gravity.setIsEnabled(false)
        this.pieces.forEach(i => i.setY(Math.round(i.getY() / CONFIG.SIZE) * CONFIG.SIZE))
    }

    public checkCollision(group: number) {
        this.pieces.forEach(p => {
            p.getTransitionX()?.update()
            p.getTransitionY()?.update()
        })

        this.pieces.forEach(p => {
            loop.forEachTarget(p.getTarget(), (item) => {
                if (item === p || p.isMoving()) return;
    
                if(p.itemCollision(p, item) === DIRECTION.TOP && item.getGroup() & group) {
                    this.onCollide()
                }
            })
        })
    }

    public getPieces() {
        return this.pieces
    }

    public getQueue() {
        return this.pieces.slice(1)
    }

    public getHead() {
        return this.pieces[0]
    }

    public getEnd() {
        return this.pieces.at(-1)
    }

    public canMoveX(newX: number): Promise<boolean> {
        return new Promise(resolve => {
            const copy = this.getHead().copy()
            copy.setX(copy.getX() + newX)
            
            loop.forEachTarget(this.getHead().getTarget(), (item) => {
                if(item.getGroup() & Block.GROUP && item.matchLocation(copy)) {
                    resolve(false)
                } else if(item.getGroup() & Stone.GROUP && item.matchLocation(copy)) {
                    const nextToStone = copy.copy().setX(copy.getX() + newX);

                    if(loop.getContainer().getItems().some(i => i.matchLocation(nextToStone)) && !this.getEnd()?.matchLocation(nextToStone)) return resolve(false);

                    (item as Stone).setTransitionX(item.getX() + newX);
                    (item as Stone).getGravity().setIsEnabled(false);
                    resolve(true)
                }
            })

            resolve(true)
        })
    }

    public canMoveY(newY: number) {
        return new Promise(resolve => {
            const copy = this.getHead().copy()
            copy.setY(copy.getY() + newY)
            Loop.getLoops()[0].forEachTarget(this.getHead().getTarget(), (item) => {
                if((item.getGroup() & Block.GROUP) !== 0 && item.matchLocation(copy)) {
                    resolve(false)
                } else if(item.getGroup() & Stone.GROUP && item.matchLocation(copy)) {
                    const nextToStone = copy.copy().setY(copy.getY() + newY);

                    if(loop.getContainer().getItems().some(i => i.matchLocation(nextToStone))) return resolve(false);

                    (item as Stone).setTransitionY(item.getY() + newY);
                    (item as Stone).getGravity().setIsEnabled(false)
                    resolve(true)
                }
            })

            resolve(true)
        })
    }

    public enlarge() {
        const newPiece = this.pieces.at(-1)!.copy().addFunctionality(this.gravity)
        loop.getContainer().addItem(newPiece)
        this.pieces.push(newPiece as WormPiece)
    }
}
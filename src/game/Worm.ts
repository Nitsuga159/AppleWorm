import Gravity from "../motor/Functions/Gravity/Gravity";
import BaseItem from "../motor/Items/BaseItem";
import { DIRECTION } from "../motor/Items/DefaultCollisions";
import Item from "../motor/Items/Item";
import Loop from "../motor/Loop";
import Block from "./Block";
import Stone from "./Stone";
import WormPiece from "./WormPiece";
import CONFIG from "./constants";
import game, { WormGame } from "./game";

export default class Worm {
    private gravity = new Gravity({ velocity: CONFIG.GRAVITY })
    private pieces: WormPiece[]

    constructor(pieces: WormPiece[]) {
        pieces.forEach(p => game.add(p.addFunctionality(this.gravity)))

        this.pieces = pieces
    }

    public setFalling(enabled: boolean) {
        this.gravity.setIsEnabled(enabled)
    }

    public isFalling() {
        return this.gravity.isEnabled()
    }

    private onCollide() {
        this.gravity.setIsEnabled(false)
        this.pieces.forEach(i => i.setY(Math.round(i.getY() / CONFIG.SIZE) * CONFIG.SIZE))
    }

    public checkCollision() {
        this.pieces.forEach(p => {
            p.getTransitionX()?.update()
            p.getTransitionY()?.update()
        })

        this.pieces.forEach(p => {
            game.forEachItemConstructor(p.getTarget(), item => {
                if (p.isMoving()) return;

                if (p.itemCollision(p, item) === DIRECTION.TOP) {
                    if(
                        item instanceof Stone && 
                        game.getFrom([item.getX(), item.getY() + CONFIG.SIZE]) instanceof WormPiece
                    ) return;
    
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

    private canMove(plus: number, dir: "X" | "Y") {
        const headLocation = this.getHead().getLocation()
        const index = dir === "X" ? 0 : 1
        headLocation[index] += plus

        let canMove = true

        game.forEachItemConstructor(this.getHead().getTarget(), item => {
            if (item instanceof Block && BaseItem.matchLocation(headLocation, item.getLocation())) {
                canMove = false
                return true
            }

            if (item instanceof Stone && BaseItem.matchLocation(headLocation, item.getLocation())) {
                const nextToStone = headLocation
                nextToStone[index] += plus

                let found = false
                game.forEachItemConstructor(item.getTarget(), (currentItem) => {
                    if (item !== currentItem && BaseItem.matchLocation(nextToStone, currentItem.getLocation())) {
                        found = true
                        return true
                    }
                });

                if (found) {
                    canMove = false
                    return true
                }

                (item as Stone).getGravity().setIsEnabled(false);
                (item as Stone)[`setTransition${dir}`](item[`get${dir}`]() + plus, () => (item as Stone).getGravity().setIsEnabled(true));
                return true
            }
        })

        return canMove
    }

    public canMoveX(newX: number): boolean {
        return this.canMove(newX, "X")
    }

    public canMoveY(newY: number): boolean {
        return this.canMove(newY, "Y")
    }

    public isMoving() {
        return this.pieces.some(p => p.isMoving())
    }

    public enlarge() {
        const newPiece = this.pieces.at(-1)!.copy().addFunctionality(this.gravity)
        game.add(newPiece)
        this.pieces.push(newPiece as WormPiece)
    }
}
import Gravity from "../motor/Functions/Gravity/Gravity";
import BaseItem from "../motor/Items/BaseItem";
import { DIRECTION } from "../motor/Items/DefaultCollisions";
import Item from "../motor/Items/Item";
import Loop from "../motor/Loop";
import Block from "./Block";
import Stone from "./Stone";
import WormPiece from "./WormPiece";
import CONFIG from "./constants";
import game from "./game";

export default class Worm {
    private gravity = new Gravity({ velocity: CONFIG.GRAVITY })
    private pieces: WormPiece[]

    constructor(pieces: WormPiece[]) {
        pieces.forEach(p => game.add(p.addFunctionality(this.gravity)))

        this.pieces = pieces
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
            game.forEachItemConstructor(p.getTarget(), ({ item }) => {
                if (p.isMoving()) return;
    
                if(p.itemCollision(p, item) === DIRECTION.TOP) {
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
            const headLocation = this.getHead().getLocation()
            headLocation[0] += newX
            
            game.forEachItemConstructor(this.getHead().getTarget(), ({ item, stop }) => {
                if(item instanceof Block && BaseItem.matchLocation(headLocation, item.getLocation())) {
                    resolve(false)
                    stop()
                } else if(item instanceof Stone && BaseItem.matchLocation(headLocation, item.getLocation())) {
                    const nextToStone = headLocation
                    nextToStone[0] += newX
                    
                    let found = false
                    game.forEachItemConstructor(item.getTarget(), ({ item: currentItem, stop }) => {
                        if(BaseItem.matchLocation(nextToStone, currentItem.getLocation())) {
                            console.log("match", currentItem)
                            stop()
                            found = true
                        }
                    });

                    if(found) return resolve(false);
                    
                    (item as Stone).setTransitionX(item.getX() + newX);
                    (item as Stone).getGravity().setIsEnabled(false);
                    resolve(true)
                    stop()
                }
            })

            resolve(true)
        })
    }

    public canMoveY(newY: number): Promise<boolean> {
        return new Promise(resolve => {
            const headLocation = this.getHead().getLocation()
            headLocation[1] += newY
            
            game.forEachItemConstructor(this.getHead().getTarget(), ({ item, stop }) => {
                if(item instanceof Block && BaseItem.matchLocation(headLocation, item.getLocation())) {
                    resolve(false)
                    stop()
                } else if(item instanceof Stone && BaseItem.matchLocation(headLocation, item.getLocation())) {
                    const nextToStone = headLocation
                    nextToStone[1] += newY
                    
                    if(game.get().some(i => BaseItem.matchLocation(nextToStone, i.getLocation()))) {
                        stop()
                        return resolve(false)
                    };
                    
                    (item as Stone).setTransitionY(item.getY() + newY);
                    (item as Stone).getGravity().setIsEnabled(false);
                    resolve(true)
                    stop()
                }
            })

            resolve(true)
        })
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
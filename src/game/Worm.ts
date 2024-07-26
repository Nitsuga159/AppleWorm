import Gravity from "../motor/Functions/Gravity/Gravity";
import BaseItem from "../motor/Items/BaseItem";
import { DIRECTION } from "../motor/Items/DefaultCollisions";
import Item from "../motor/Items/Item";
import Loop from "../motor/Loop";
import Block from "./objects/Block";
import Stone from "./objects/Stone";
import WormPiece from "./objects/WormPiece";
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
        this.pieces.forEach(i => {
            i.setY(Math.round(i.getY() / CONFIG.SIZE) * CONFIG.SIZE)
            i.setNextY(i.getY())
        })

        this.checkQueueFrame()
        this.checkEndFrame()
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
                    if (
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

    public isMoving() {
        return this.pieces.some(p => p.isMoving())
    }

    public enlarge() {
        const newPiece = this.pieces.at(-1)!.copy().addFunctionality(this.gravity)
        game.add(newPiece)
        this.pieces.push(newPiece as WormPiece)
    }

    public checkHeadFrame([prevX, prevY]: number[], [newX, newY]: number[]) {
        const head = this.getHead()

        if (prevX !== newX) {
            head.setFrameProperty("spin", newX < prevX ? -180 : 0)
        } else {
            head.setFrameProperty("spin", newY < prevY ? -90 : 90)
        }
    }

    public checkQueueFrame() {
        const pieces = this.getPieces().slice()
        for (let i = 1; i < pieces.length - 1; i++) {
            const [headNextX, headNextY] = pieces[i - 1].getNextLocation()
            const [nextX, nextY] = pieces[i].getNextLocation()
            const [queueNextX, queueNextY] = pieces[i + 1].getNextLocation()

            //horizontal
            if (nextY === headNextY && nextY === queueNextY) {
                pieces[i].setFrameProperty("index", 2)
                pieces[i].setFrameProperty("spin", 0)
            } //vertical
            else if (nextX === headNextX && nextX === queueNextX) {
                pieces[i].setFrameProperty("index", 2)
                pieces[i].setFrameProperty("spin", 90)
            }
            else if ((headNextX < nextX && queueNextY > nextY) || (queueNextX < nextX && headNextY > nextY)) {
                pieces[i].setFrameProperty("index", 4)
                pieces[i].setFrameProperty("spin", -90)
                pieces[i].setFrameProperty("flip", false)
            }
            else if ((headNextY < nextY && queueNextX < nextX) || (queueNextY < nextY && headNextX < nextX)) {
                pieces[i].setFrameProperty("index", 4)
                pieces[i].setFrameProperty("spin", 0)
                pieces[i].setFrameProperty("flip", false)
            }
            else if ((headNextX > nextX && queueNextY > nextY) || (queueNextX > nextX && headNextY > nextY)) {
                pieces[i].setFrameProperty("index", 4)
                pieces[i].setFrameProperty("spin", 90)
                pieces[i].setFrameProperty("flip", true)
            }
            else {
                pieces[i].setFrameProperty("index", 4)
                pieces[i].setFrameProperty("spin", 0)
                pieces[i].setFrameProperty("flip", true)
            }
        }
    }

    public checkEndFrame() {
        const pieces = this.getPieces()

        const [endNextX, endNextY] = pieces.at(-1)!.getNextLocation()
        const [connNextX, connNextY] = pieces.at(-2)!.getNextLocation()
        if (endNextX === connNextX && endNextY > connNextY) {
            pieces.at(-1)!.setFrameProperty("index", 3)
            pieces.at(-1)!.setFrameProperty("spin", -90)
        } else if (endNextX === connNextX && endNextY < connNextY) {
            pieces.at(-1)!.setFrameProperty("index", 3)
            pieces.at(-1)!.setFrameProperty("spin", 90)
        } else if (endNextY === connNextY && endNextX < connNextX) {
            pieces.at(-1)!.setFrameProperty("index", 3)
            pieces.at(-1)!.setFrameProperty("spin", 0)
        } else {
            pieces.at(-1)!.setFrameProperty("index", 3)
            pieces.at(-1)!.setFrameProperty("spin", 180)
        }
    }
}
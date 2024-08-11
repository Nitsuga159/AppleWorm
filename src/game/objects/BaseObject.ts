import GameMap from "../../motor/GameMap";
import { ILocation } from "../../motor/Items/IBaseItem";
import { IItem } from "../../motor/Items/IItem";
import Transition from "../../motor/Items/Transition";
import Square from "../../motor/Shape/Square";
import CONFIG from "../constants";
import WormPiece from "./WormPiece";

export interface IBaseObject extends IItem {
    canMove: boolean
    canRotate: boolean
}

export default abstract class BaseObject extends Square {
    private canRotate: boolean
    private canMove: boolean
    private nextX: number = 0
    private nextY: number = 0
    private transitionX: Transition | null = null
    private transitionY: Transition | null = null
    public last: boolean = false

    constructor({ x, y, canMove, canRotate, ...data }: IBaseObject) {
        super({ ...data, x: x * CONFIG.SIZE, y: y* CONFIG.SIZE })

        this.nextX = x * CONFIG.SIZE
        this.nextY = y * CONFIG.SIZE
        this.canMove = canMove
        this.canRotate = canRotate
    }

    public copy() {
        return new (this.constructor as any)({ x: this.getX() / CONFIG.SIZE, y: this.getY() / CONFIG.SIZE, width: this.getWidth(), height: this.getHeight(), frame: { index: this.getFrameProperty("index"), frameSize: this.getFrameProperty("frameSize"), textureId: this.getFrameProperty("textureId") } })
    }

    public isMoving() {
        return this.transitionX !== null || this.transitionY !== null
    }

    public update(): void {
        this.transitionX?.update()
        this.transitionY?.update()
    }

    public getCanMove() {
        return this.canMove
    }

    public getCanRotate() {
        return this.canRotate
    }

    public getTransitionX() {
        return this.transitionX
    }

    public getTransitionY() {
        return this.transitionY
    }

    public getNextX() {
        return this.nextX
    }

    public getNextY() {
        return this.nextY
    }

    public setNextX(nextX: number) {
        this.nextX = nextX
    }

    public setNextY(nextY: number) {
        this.nextY = nextY
    }

    public getNextLocation() {
        return [this.nextX, this.nextY]
    }

    public getDistanceX(bo: BaseObject) {
        return this.getX() - bo.getX()
    }

    public getDistanceY(bo: BaseObject) {
        return this.getY() - bo.getY()
    }

    /**
     * Calculate the distance of X and Y between the 'this' - 'bo' (Base Object)
     */
    public getDistance(bo: BaseObject): [ distX: number, distY: number ] {
        return [this.getDistanceX(bo), this.getDistanceY(bo)]
    }

    /**
     * Use Transition class to make a smooth move from/to in X/Y direction
     */
    public setTransition({ next, dir, onEnd, onlyFrame, frames = 10 }: { next: number, dir: "X" | "Y", onlyFrame: boolean, onEnd?: () => void, frames?: number }) {
        const getterDirLocation = onlyFrame ? () => this.getFrameProperty(`frame${dir}`)! : () => this[`get${dir}`]()
        const setterDirLocation = onlyFrame ? (v: number) => this.setFrameProperty(`frame${dir}`, getterDirLocation() + v) : (v: number) => this[`add${dir}`](v)

        this[`next${dir}`] = next
        this[`transition${dir}`] =
        new Transition({
            frames,
            from: getterDirLocation(),
            to: next,
            cb: setterDirLocation,
            onEnd: () => {
                this[`transition${dir}`] = null
                onEnd && onEnd()
            }
        })
    }

    public setTransitionFrameY(newY: number, onEnd?: () => void) {
        this.setTransition({
            next: newY,
            dir: "Y",
            onEnd,
            onlyFrame: true
        })
    }
    
    public setTransitionFrameX(newX: number, onEnd?: () => void) {
        this.setTransition({
            next: newX,
            dir: "X",
            onEnd,
            onlyFrame: true
        })
    }
    
    public setTransitionY(newY: number, onlyFrame: boolean, cb?: () => void) {
        this.setTransition({
                next: newY,
                dir: "Y",
                onlyFrame,
                onEnd: () => {
                this.setY(newY)
                cb && cb()
            }
        })
    }
    
    public setTransitionX(newX: number, onlyFrame: boolean, onEnd?: () => void) {
        this.setTransition({
                next: newX,
                dir: "X",
                onlyFrame,
            onEnd: () => {
                this.setX(newX)
                onEnd && onEnd()
            }
        })
    }

    public async setChainTransition(locations: ILocation[], onFinish?: () => void) {
        this.setFrameProperty("syncLocation", false)

        for(let i = 0; i < locations.length; i++) {
            if(i === locations.length - 3) {
                this.last = true
            }

            const { x, y } = locations[i]
            await new Promise(resolve => {
                let transitionX = false
                let transitionY = false

                this.setTransitionFrameX(x, () => {
                    transitionX = true
                    transitionY && resolve(1)
                });
                this.setTransitionFrameY(y, () => {
                    transitionY = true
                    transitionX && resolve(1)
                });
            })

            onFinish && onFinish()
        }
    }

    /**
     * A function that invoke when the worm head collides with the item. Returns a boolean if can worm pass to the position of the object
     */
    public abstract onWormHeadCollide(headCube: WormPiece, game: GameMap): boolean
}
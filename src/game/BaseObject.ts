import Gravity from "../motor/Functions/Gravity/Gravity";
import { ILocation } from "../motor/Items/IBaseItem";
import Transition from "../motor/Items/Transition";
import Square from "../motor/Shape/Square";

export default abstract class BaseObject extends Square {
    private transitionX: Transition | null = null
    private transitionY: Transition | null = null

    public isMoving() {
        return this.transitionX !== null || this.transitionY !== null
    }

    public update(): void {
        this.transitionX?.update()
        this.transitionY?.update()
    }

    public getTransitionX() {
        return this.transitionX
    }

    public getTransitionY() {
        return this.transitionY
    }

    public setTransitionFrameY(newY: number, cb?: () => void, frames: number = 10) {
        this.transitionY =
            new Transition({
                frames,
                from: this.getFrameProperty("frameY")!,
                to: newY,
                cb: (v) => this.setFrameProperty(
                    "frameY",
                    this.getFrameProperty("frameY")! + v
                ),
                onEnd: () => {
                    this.transitionY = null
                    cb && cb()
                }
            })
    }

    public setTransitionFrameX(newX: number, cb?: () => void, frames: number = 10) {
        this.transitionX =
            new Transition({
                frames,
                from: this.getFrameProperty("frameX")!,
                to: newX,
                cb: (v) => this.setFrameProperty(
                    "frameX",
                    this.getFrameProperty("frameX")! + v
                ),
                onEnd: () => {
                    this.transitionX = null
                    cb && cb()
                }
            })
    }

    public setTransitionX(newX: number, cb?: () => void, frames: number = 10) {
        this.setFrameProperty("syncLocation", false)
        this.transitionX =
            new Transition({
                frames,
                from: this.getX(),
                to: newX,
                cb: (v) => this.setFrameProperty(
                    "frameX",
                    this.getFrameProperty("frameX")! + v
                ),
                onEnd: () => {
                    this.setFrameProperty("syncLocation", true)
                    this.setX(newX)
                    this.transitionX = null
                    cb && cb()
                }
            })
    }

    public setTransitionY(newY: number, cb?: () => void, frames: number = 10) {
        this.setFrameProperty("syncLocation", false)
        this.transitionY =
            new Transition({
                frames,
                from: this.getY(),
                to: newY,
                cb: (v) => this.setFrameProperty(
                    "frameY",
                    this.getFrameProperty("frameY")! + v
                ),
                onEnd: () => {
                    this.setFrameProperty("syncLocation", true)
                    this.setY(newY)
                    this.transitionY = null
                    cb && cb()
                }
            })

    }

    public async setChainTransition(locations: ILocation[]) {
        for(let { x, y } of locations) {
            await new Promise(resolve => {
                let transitionX = false
                let transitionY = false

                this.setTransitionFrameX(x, () => {
                    transitionX = true
                    transitionY && resolve(1)
                }, 20);
                this.setTransitionFrameY(y, () => {
                    transitionY = true
                    transitionX && resolve(1)
                }, 20);
            })
        }
    }
}
import Gravity from "../../motor/Functions/Gravity/Gravity";
import { ILocation } from "../../motor/Items/IBaseItem";
import { IItem } from "../../motor/Items/IItem";
import Transition from "../../motor/Items/Transition";
import Square from "../../motor/Shape/Square";

export default class BaseObject extends Square {
    private nextX: number = 0
    private nextY: number = 0
    private transitionX: Transition | null = null
    private transitionY: Transition | null = null
    public last: boolean = false

    constructor(data: IItem) {
        super(data)

        this.nextX = data.x
        this.nextY = data.y
    }

    public copy() {
        return new BaseObject({ x: this.getX(), y: this.getY(), width: this.getWidth(), height: this.getHeight(), frame: { index: this.getFrameProperty("index"), frameSize: this.getFrameProperty("frameSize"), textureId: this.getFrameProperty("textureId") } })
    }

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

    public setTransitionFrameY(newY: number, cb?: () => void, frames: number = 10) {
        this.nextY = newY
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
        this.nextX = newX
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
        this.nextX = newX
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
        this.nextY = newY
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
                }, 10);
                this.setTransitionFrameY(y, () => {
                    transitionY = true
                    transitionX && resolve(1)
                }, 10);
            })

            if(onFinish) onFinish()
        }
    }
}
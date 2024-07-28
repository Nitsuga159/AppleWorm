import GameMap from "../../motor/GameMap";
import { ILocation } from "../../motor/Items/IBaseItem";
import { IItem } from "../../motor/Items/IItem";
import Transition from "../../motor/Items/Transition";
import Square from "../../motor/Shape/Square";
import WormPiece from "./WormPiece";

export default abstract class BaseObject extends Square {
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
        return new (this.constructor as any)({ x: this.getX(), y: this.getY(), width: this.getWidth(), height: this.getHeight(), frame: { index: this.getFrameProperty("index"), frameSize: this.getFrameProperty("frameSize"), textureId: this.getFrameProperty("textureId") } })
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

    public getDistanceX(bo: BaseObject) {
        return this.getX() - bo.getX()
    }

    public getDistanceY(bo: BaseObject) {
        return this.getY() - bo.getY()
    }

    /**
     * Calculate the distance of X and Y between the this object and bo (Base Object)
     * @param bo {BaseObject.class}
     */
    public getDistance(bo: BaseObject): [ distX: number, distY: number ] {
        return [this.getDistanceX(bo), this.getDistanceY(bo)]
    }

    public setTransition({ next, dir, cb, onlyFrame, frames = 10 }: { next: number, dir: "X" | "Y", onlyFrame: boolean, cb?: () => void, frames?: number }) {
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
                    cb && cb()
                }
            })
    }

    public setTransitionFrameY(newY: number, cb?: () => void) {
        this.setTransition({
            next: newY,
            dir: "Y",
            cb,
            onlyFrame: true
        })
    }
    
    public setTransitionFrameX(newX: number, cb?: () => void) {
        this.setTransition({
            next: newX,
            dir: "X",
            cb,
            onlyFrame: true
        })
    }
    
    public setTransitionY(newY: number, onlyFrame: boolean, cb?: () => void) {
        this.setTransition({
                next: newY,
                dir: "Y",
                onlyFrame,
            cb: () => {
                this.setY(newY)
                cb && cb()
            }
        })
    }
    
    public setTransitionX(newX: number, onlyFrame: boolean, cb?: () => void) {
        this.setTransition({
                next: newX,
                dir: "X",
                onlyFrame,
            cb: () => {
                this.setX(newX)
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
                });
                this.setTransitionFrameY(y, () => {
                    transitionY = true
                    transitionX && resolve(1)
                });
            })

            if(onFinish) onFinish()
        }
    }

    public abstract onCollide(headCube: WormPiece, game: GameMap): boolean
}
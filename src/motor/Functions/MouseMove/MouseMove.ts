import EventController from "../../EventController";
import { ILocation } from "../../Items/IBaseItem";
import MousePress from "../MousePress/MousePress";
import { IMouseMove } from "./IMouseMove";

export default class MouseMove {
    private mousePress: MousePress
    private enabled = true
    private onMouseMove: (ev: MouseEvent) => void
    private prevLocation: ILocation = { x: 0, y: 0 }
    private onNewLocation?: (n: ILocation) => void

    constructor({ target, encapsulate, canMove, onNewLocation }: IMouseMove) {
        this.onNewLocation = onNewLocation

        this.mousePress = new MousePress({ baseItem: target, onChange: (isPressed) => {
            if(!isPressed) {
                this.onNewLocation?.({ x: target.getX(), y: target.getY() })
            } else {
                this.prevLocation = { x: target.getX(), y: target.getY() }
                console.log(this.prevLocation)
            }
        } })

        let prevX: number = 0
        let prevY: number = 0

        this.onMouseMove = ({ pageX: x, pageY: y }: MouseEvent) => {
            if(prevX && prevY && (!encapsulate || this.mousePress.isPressed())  && (!canMove || canMove())) {
                target.addX(x - prevX).addY(y - prevY)
            }
    
            prevX = x
            prevY = y
        }

        EventController.addListener("mousemove", this.onMouseMove)
    }

    public enable() {
        if(this.enabled) return;

        EventController.addListener("mousemove", this.onMouseMove)
    }

    public disable() {
        if(!this.enabled) return;

        EventController.deleteListener("mousemove", this.onMouseMove)
        this.enabled = false;
    }

    public isEnabled() {
        return this.enabled
    }

    public getPrevLocation() {
        return this.prevLocation
    }

    public setOnNewLocation(onNewLocation: (n: ILocation) => void) {
        this.onNewLocation = onNewLocation
    }
}
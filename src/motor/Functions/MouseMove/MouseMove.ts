import EventController from "../../EventController";
import MousePress from "../MousePress/MouseClick";
import { IMouseMove } from "./IMouseMove";

export default class MouseMove {
    private mousePress: MousePress
    private enabled = true
    private onMouseMove: (ev: MouseEvent) => void

    constructor({ baseItem, encapsulate }: IMouseMove) {
        this.mousePress = new MousePress({ baseItem })

        let prevX: number = 0
        let prevY: number = 0

        this.onMouseMove = ({ pageX: x, pageY: y }: MouseEvent) => {


            if(prevX && prevY && (!encapsulate || this.mousePress.isPressed())) {
                baseItem.addX(x - prevX).addY(y - prevY)
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
}
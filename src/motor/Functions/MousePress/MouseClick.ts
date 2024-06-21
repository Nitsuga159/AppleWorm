import Canvas from "../../Canvas";
import EventController from "../../EventController";
import BaseItem from "../../Items/BaseItem";

export default class MousePress {
    private enabled = true
    private pressed = false
    private onMouseDown: (ev: MouseEvent) => void
    private onMouseUp: (ev: MouseEvent) => void
    private onChange?: (clicked: boolean, ev: MouseEvent) => void
    
    constructor({ baseItem, onChange }: { baseItem: BaseItem, onChange?: (clicked: boolean, ev: MouseEvent) => void }) {
        this.onChange = onChange
        this.onMouseDown = (ev) => {
            console.log(ev.pageX, ev.pageY, Canvas.getCanvas().getBoundingClientRect())
            console.log(baseItem.isInArea({ x: ev.pageX, y: ev.pageY }))
            let prevState = this.pressed
            this.pressed = baseItem.isInArea({ x: ev.clientX, y: ev.clientY })

            if(prevState !== this.pressed) this.onChange??(this.pressed, ev)
        }
        this.onMouseUp = (ev) => {
            if(this.pressed) {
                this.pressed = false
                this.onChange??(this.pressed, ev)
            }
        }

        EventController.addListener("mousedown", this.onMouseDown)
        EventController.addListener("mouseup", this.onMouseUp)
    }
    
    public setOnChange(onChange: (clicked: boolean, ev: MouseEvent) => void) {
        this.onChange = onChange
    }
    
    public enable() {
        if(this.enabled) return;
        
        EventController.addListener("mousedown", this.onMouseDown)
        EventController.addListener("mouseup", this.onMouseUp)
    }
    
    public disable() {
        if(!this.enabled) return;
        
        EventController.deleteListener("mousedown", this.onMouseDown)
        EventController.deleteListener("mouseup", this.onMouseUp)
        this.enabled = false;
    }

    public isEnabled() {
        return this.enabled
    }

    public isPressed() {
        return this.pressed
    }
}
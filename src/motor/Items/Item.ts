import Function from "../Functions/Function";
import DefaultCollisions from "./DefaultCollisions";
import { IBounds } from "./IBaseItem";
import { IFrame, IItem } from "./IItem";

export default abstract class Item extends DefaultCollisions {
    private static ALL_ITEMS: Item[]
    protected fill: string | undefined
    private group: (typeof Item)[]
    private target: (typeof Item)[]
    private readonly functionalities: Function[] = []
    private frame?: IFrame
    private texture?: HTMLImageElement
    private paintPriority: number

    constructor({ fill, group, target, paintPriority, textureId, frame, ...data }: IItem) {
        super(data)

        if (!(this.constructor as any).ALL_ITEMS) {
            (this.constructor as any).ALL_ITEMS = []
        }
            
        this.fill = fill
        this.target = target || []
        this.group = group || []
        this.frame = frame
        this.paintPriority = paintPriority || 0
        
        if(textureId) {
            this.texture = (document.getElementById(textureId) as HTMLImageElement)
        }

        (this.constructor as any).ALL_ITEMS.push(this)
    }

    public static getAllItems(): Item[] | undefined {
        return this.ALL_ITEMS
    }

    public static resetAllItems() {
        this.ALL_ITEMS = []
    }

    public static removeItem(item: Item) {
        this.ALL_ITEMS = this.ALL_ITEMS.filter(i => i !== item)
    }

    public getTexture() {
        return this.texture
    }

    public setGroup(group: (typeof Item)[]) {
        this.group = group

        return this
    }

    public setTarget(target: (typeof Item)[]) {
        this.target = target

        return this
    }

    public setPaintPriority(paintPriority: number) {
        this.paintPriority = paintPriority
    }

    public getPaintPriority() {
        return this.paintPriority
    }

    public getFill() {
        return this.fill
    }

    public getTarget() {
        return this.target
    }

    public getGroup() {
        return this.group
    }

    public getFunctionalities() {
        return this.functionalities
    }

    public getFrame() {
        return this.frame
    }

    public addFunctionality(functionality: Function) {
        this.functionalities.push(functionality)

        return this
    }

    public matchLocation(item: Item) {
        return this.getX() === item.getX() && this.getY() === item.getY()
    }

    public getFrameCoordinates() {
        if(!this.frame) return null;

        const { index, columns = 1, size } = this.frame

        const x = ((index - 1) % columns) * size;
        const y = Math.floor((index - 1) / columns) * size;
        return { x, y };
    }

    abstract update(): void

    abstract paint(ctx: CanvasRenderingContext2D): void

    abstract shouldPaint(): boolean
}
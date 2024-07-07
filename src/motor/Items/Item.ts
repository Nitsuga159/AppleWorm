import { Class } from "../../game/interfaces/Class";
import Function from "../Functions/Function";
import BaseItem from "./BaseItem";
import DefaultCollisions from "./DefaultCollisions";
import Frame from "./Frame";
import { IItem } from "./IItem";

export default abstract class Item extends Frame(DefaultCollisions(BaseItem)) {
    private readonly functionalities: Function[] = []
    private static ALL_ITEMS: Item[]
    protected fill: string | undefined
    private group: Class<Item>[]
    private target: Class<Item>[]
    private paintPriority: number
    private debug: boolean

    constructor({ fill, group, target, debug, paintPriority, ...data }: IItem) {
        super(data)

        if (!(this.constructor as any).ALL_ITEMS) {
            (this.constructor as any).ALL_ITEMS = []
        }
            
        this.debug = debug || false
        this.fill = fill
        this.target = target || []
        this.group = group || []
        this.paintPriority = paintPriority || 0;

        (this.constructor as any).ALL_ITEMS.push(this)
    }

    public static getAllItems(): Item[] {
        return this.ALL_ITEMS || []
    }

    public static resetAllItems() {
        this.ALL_ITEMS = []
    }

    public static removeItem(item: Item) {
        this.ALL_ITEMS = this.ALL_ITEMS.filter(i => i !== item)
    }

    public setGroup(group: Class<Item>[]) {
        this.group = group

        return this
    }

    public setTarget(target: Class<Item>[]) {
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

    public addFunctionality(functionality: Function) {
        this.functionalities.push(functionality)

        return this
    }

    public matchLocation(item: Item) {
        return this.getX() === item.getX() && this.getY() === item.getY()
    }

    public isDebug() {
        return this.debug
    }

    public setIsDebug(debug: boolean) {
        this.debug = debug
    }

    abstract update(): void

    abstract paint(ctx: CanvasRenderingContext2D): void

    abstract shouldPaint(): boolean
}
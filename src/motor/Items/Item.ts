import Function from "../Functions/Function";
import BaseItem from "./BaseItem";
import DefaultCollisions from "./DefaultCollisions";
import { IItem } from "./IItem";

export default abstract class Item extends DefaultCollisions {
    protected fill: string | undefined
    private group: number
    private target: number
    private readonly functionalities: Function[] = []

    constructor({ fill, group, target, ...data }: IItem) {
        super(data)

        this.fill = fill
        this.target = target || 0
        this.group = group || 0
    }

    public setGroup(group: number) {
        this.group = group

        return this
    }

    public setTarget(target: number) {
        this.target = target

        return this
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

    abstract update(): void

    abstract paint(ctx: CanvasRenderingContext2D): void

    abstract shouldPaint(): boolean
}
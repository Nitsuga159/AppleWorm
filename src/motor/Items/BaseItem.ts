import { IBounds, ILocation } from "./IBaseItem"

export default class BaseItem {
    private width: number
    private height: number
    private x: number
    private y: number
    private prevX: number = 0
    private prevY: number = 0

    constructor({ width, height, x, y }: IBounds) {
        this.width = width
        this.height = height
        this.x = x
        this.y = y
    }

    public getX() {
        return this.x
    }
    
    public getY() {
        return this.y
    }

    public getLocation(): [number, number] {
        return [this.x, this.y]
    }

    public getWidth() {
        return this.width
    }

    public getHeight() {
        return this.height
    }

    public getBounds(): [number, number, number, number] {
        return [this.x, this.y, this.width, this.height]
    }

    public setX(x: number) {
        this.prevX = this.x
        this.x = x

        return this
    }

    public addX(increment: number) {
        this.x += increment

        return this
    }

    public setY(y: number) {
        this.prevY = this.y
        this.y = y

        return this
    }

    public addY(increment: number) {
        this.y += increment

        return this
    }

    public setLocation(x: number, y: number) {
        this.prevX = this.x
        this.prevY = this.y
        this.x = x
        this.y = y 

        return this
    }

    public setWidth(width: number) {
        this.width = width

        return this
    }

    public setHeight(height: number) {
        this.height = height

        return this
    }

    public setBounds(x: number, y: number, width: number, height: number) {
        this.prevX = this.x
        this.prevY = this.y
        this.x = x
        this.y = y 
        this.width = width
        this.height = height

        return this
    }

    public getPrevLocation() {
        return [this.prevX, this.prevY]
    }

    public getPrevX() {
        return this.prevX
    }

    public getPrevY() {
        return this.prevY
    }

    public isInArea({ x, y }: ILocation) {
        return x >= this.getX() && x <= (this.getX() + this.getWidth()) && y >= this.getY() && y <= (this.getY() + this.getHeight())
    }

    public static matchLocation(loc1: [x: number, y: number], loc2: [x: number, y: number]) {
        return loc1[0] === loc2[0] && loc1[1] === loc2[1]
    }
}
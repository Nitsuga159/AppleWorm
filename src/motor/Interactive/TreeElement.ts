
import BaseItem from "../Items/BaseItem";
import { ILocation, ILocationArray } from "../Items/IBaseItem";
import { IItem } from "../Items/IItem";
import Item from "../Items/Item";
import Square from "../Shape/Square";

export interface ITreeElement extends IItem {
    parent?: TreeElement
}

export default class TreeElement extends Square {
    private children: TreeElement[]
    private parent?: TreeElement
    private radius: number = 0

    constructor({ parent, ...data }: ITreeElement) {
        super(data)

        this.children = [];
        this.parent = parent;
    }

    public setRadius(radius: number) {
        this.radius = radius
    }

    public getRadius() {
        return this.radius
    }

    public getChilds() {
        return this.children
    }

    public addChild(child: TreeElement) {
        if (!this.contains(child.getLocation())) {
            return false
        }

        child.parent = this;
        this.children.push(child);

        return true
    }

    public findMatches(point: ILocationArray, found: TreeElement[] = []): TreeElement[] {
        if (!this.contains(point)) {
            return found;
        }

        found.push(this);

        for (const child of this.children) {
            child.findMatches(point, found);
        }

        return found;
    }

    public findLast(point: ILocationArray, closest: TreeElement | null = null, distance: number = Infinity): TreeElement | null {
        for (const child of this.children) {
            if (child.contains(point)) {
                let childDist = (Math.sqrt((child.getX() - point[0]) ** 2 + (child.getY() - point[0]) ** 2))
                if (childDist < distance) {
                    closest = child.findLast(point, child, childDist);
                }
            }
        }

        return closest || this;
    }

    public fillSquare(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.getFill() || "black"
        ctx.fillRect(...this.getBounds())
    }

    public fillSquareBorderRadius(ctx: CanvasRenderingContext2D) {
        const [x, y, width, height] = this.getBounds()
        const radius = this.radius

        ctx.beginPath();

        ctx.moveTo(x + radius, y);

        ctx.lineTo(x + width - radius, y);

        ctx.bezierCurveTo(
            x + width, y,
            x + width, y,
            x + width, y + radius
        );

        ctx.lineTo(x + width, y + height - radius);

        ctx.bezierCurveTo(
            x + width, y + height,
            x + width, y + height,
            x + width - radius, y + height
        );

        ctx.lineTo(x + radius, y + height);

        ctx.bezierCurveTo(
            x, y + height,
            x, y + height,
            x, y + height - radius
        );

        ctx.lineTo(x, y + radius);

        ctx.bezierCurveTo(
            x, y,
            x, y,
            x + radius, y
        );

        ctx.closePath()
    }
}
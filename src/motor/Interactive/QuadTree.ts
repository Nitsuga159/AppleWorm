import BaseItem from "../Items/BaseItem";
import { ILocationArray } from "../Items/IBaseItem";

export default class QuadTree {
    private bounds: BaseItem
    private capacity: number
    private points: BaseItem[]
    private divided: boolean

    private northeast?: QuadTree
    private northwest?: QuadTree
    private southeast?: QuadTree
    private southwest?: QuadTree

    constructor(bounds: BaseItem, capacity: number) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    public subdivide() {
        let x = this.bounds.getX();
        let y = this.bounds.getY();
        let width = this.bounds.getWidth() / 2;
        let height = this.bounds.getHeight() / 2;

        let ne = new BaseItem({ x: x + width, y, width, height });
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new BaseItem({ x, y, width, height });
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new BaseItem({ x: x + width, y: y + height, width, height });
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new BaseItem({ x, y: y + height, width, height });
        this.southwest = new QuadTree(sw, this.capacity);

        this.divided = true;
    }

    public insert(point: BaseItem) {
        if (!this.bounds.contains(point.getLocation())) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        if (this.northeast!.insert(point)) {
            return true;
        } else if (this.northwest!.insert(point)) {
            return true;
        } else if (this.southeast!.insert(point)) {
            return true;
        } else if (this.southwest!.insert(point)) {
            return true;
        }
    }

    queryAllMatches(range: ILocationArray, found?: BaseItem[]): BaseItem[] {
        if (!found) {
            found = [];
        }

        if (!this.bounds.contains(range)) {
            return found;
        }

        for (let p of this.points) {
            if (p.contains(range)) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northwest!.queryAllMatches(range, found);
            this.northeast!.queryAllMatches(range, found);
            this.southwest!.queryAllMatches(range, found);
            this.southeast!.queryAllMatches(range, found);
        }

        return found;
    }

    query(range: ILocationArray, closest?: BaseItem, closestDist: number = Infinity): BaseItem | undefined {
        const [x, y] = range

        if (!this.bounds.contains(range)) {
            return closest;
        }

        for (let p of this.points) {
            if (p.contains(range)) {
                let dist = Math.sqrt((p.getX() - x) ** 2 + (p.getY() - y) ** 2);
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = p;
                }
            }
        }

        if (this.divided) {
            closest = this.northwest!.query(range, closest, closestDist);
            closest = this.northeast!.query(range, closest, closestDist);
            closest = this.southwest!.query(range, closest, closestDist);
            closest = this.southeast!.query(range, closest, closestDist);
        }

        return closest;
    }


    queryA(x: number, y: number, found?: BaseItem[]) {
        if (!found) {
            found = [];
        }

        if (!this.bounds.intersectsPoint(x, y)) {
            return found;
        }

        for (let p of this.points) {
            if (p.getX() === x && p.getY() === y) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northwest!.queryA(x, y, found);
            this.northeast!.queryA(x, y, found);
            this.southwest!.queryA(x, y, found);
            this.southeast!.queryA(x, y, found);
        }

        return found;
    }
}
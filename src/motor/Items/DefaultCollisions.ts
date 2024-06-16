import BaseItem from "./BaseItem";

export enum DIRECTION {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

export default class DefaultCollisions extends BaseItem {
    public itemCollision(item1: BaseItem, item2: BaseItem) {
        const [x1, y1, w1, h1] = item1.getBounds()
        const [x2, y2, w2, h2] = item2.getBounds()

        const collision = !(
            x1 > x2 + w2 ||
            x1 + w1 < x2 ||
            y1 > y2 + h2 ||
            y1 + h1 < y2
        )

        if(!collision) return null;

        var playerHalfW = w1 / 2
        var playerHalfH = h1 / 2
        var enemyHalfW = w2 / 2
        var enemyHalfH = h2 / 2
        var playerCenterX = x1 + w1 / 2
        var playerCenterY = y1 + h1 / 2
        var enemyCenterX = x2 + w2 / 2
        var enemyCenterY = y2 + h2 / 2

        // Calculate the distance between centers
        var diffX = playerCenterX - enemyCenterX
        var diffY = playerCenterY - enemyCenterY

        // Calculate the minimum distance to separate along X and Y
        var minXDist = playerHalfW + enemyHalfW
        var minYDist = playerHalfH + enemyHalfH

        // Calculate the depth of collision for both the X and Y axis
        var depthX = diffX > 0 ? minXDist - diffX : -minXDist - diffX
        var depthY = diffY > 0 ? minYDist - diffY : -minYDist - diffY

        // Now that you have the depth, you can pick the smaller depth and move
        // along that axis.
        if (depthX != 0 && depthY != 0) {
            if (Math.abs(depthX) < Math.abs(depthY)) {
                // Collision along the X axis. React accordingly
                if (depthX < 0) {
                    return DIRECTION.LEFT
                } else {
                    return DIRECTION.RIGHT
                }
            } else {
                // Collision along the Y axis.
                if (depthY < 0) {
                    //this.setY(item2.getY() - this.getHeight())
                    return DIRECTION.TOP
                    } else {
                    //this.setY(item2.getY() + item2.getHeight())
                    return DIRECTION.BOTTOM
                }
            }
        }
    }

    public isBottom(item1: BaseItem, item2: BaseItem) {
        if (this.isInX(item1, item2) && item1.getY() <= item2.getY() + item2.getHeight()) {
            return {
                target: item2,
                direction: DIRECTION.BOTTOM
            }
        }
    }

    public isTop(item1: BaseItem, item2: BaseItem) {
        if (this.isInX(item1, item2) && item1.getY() >= item2.getY()) {
            return {
                target: item2,
                direction: DIRECTION.TOP
            }
        }
    }

    public isRight(item1: BaseItem, item2: BaseItem) {
        if (this.isInY(item1, item2) && item1.getX() <= item2.getX() + item2.getWidth()) {
            return {
                target: item2,
                direction: DIRECTION.RIGHT
            }
        }
    }

    public isLeft(item1: BaseItem, item2: BaseItem) {
        if (this.isInY(item1, item2) && item1.getX() >= item2.getX()) {
            return {
                target: item2,
                direction: DIRECTION.LEFT
            }
        }
    }

    public isInY(item1: BaseItem, item2: BaseItem) {
        const y1 = item1.getY()
        const height1 = item1.getHeight()
        const y2 = item2.getY()
        const height2 = item2.getHeight()

        return y1 + height1 >= y2 && y1 <= y2 + height2
    }

    public isInX(item1: BaseItem, item2: BaseItem) {
        const x1 = item1.getX()
        const width1 = item1.getWidth()
        const x2 = item2.getX()
        const width2 = item2.getWidth()

        return x1 + width1 >= x2 && x1 <= x2 + width2
    }
}
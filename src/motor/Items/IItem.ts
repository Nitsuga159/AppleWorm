import { IBounds, ILocation } from "./IBaseItem";
import Item from "./Item";

export interface IFrame {
    index: number
    size: number
    columns?: number
    delX?: number
    delY?: number
    rows?: number
    flip?: boolean
    spin?: number
}

export interface IItem extends IBounds {
    fill?: string
    target?: (typeof Item)[]
    group?: (typeof Item)[]
    textureId?: string
    frame?: IFrame
    paintPriority?: number
}
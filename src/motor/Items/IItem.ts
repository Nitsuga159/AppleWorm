import { Class } from "../../game/interfaces/Class";
import { IFrame } from "./Frame";
import { IBounds, ILocation } from "./IBaseItem";
import Item from "./Item";

export interface IItem extends IBounds {
    debug?: boolean,
    fill?: string
    target?: Class<Item>[]
    group?: Class<Item>[]
    textureId?: string
    frame?: IFrame
    paintPriority?: number
}
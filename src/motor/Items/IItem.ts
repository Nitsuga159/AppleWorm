import { IBounds } from "./IBaseItem";

export interface IItem extends IBounds {
    fill?: string
    target?: number
    group?: number
}
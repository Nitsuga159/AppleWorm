import { IItem } from "../../motor/Items/IItem";

export interface IPSeudoItem extends Omit<IItem, "target" | "group" | "width" | "height" | "frame"> {
    index: number
    spin?: number
}
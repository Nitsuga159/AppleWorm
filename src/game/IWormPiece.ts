import { IItem } from "../motor/Items/IItem";

export interface IWormPiece extends IItem {
    onCollide?: () => void
}
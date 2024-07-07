import BaseItem from "../../Items/BaseItem";
import { ILocation } from "../../Items/IBaseItem";

export interface IMouseMove {
    target: BaseItem
    encapsulate?: boolean
    canMove?: () => boolean
    onNewLocation?: (newLocation: ILocation) => void
}
import { IFrame, IItem } from "../motor/Items/IItem";
import Square from "../motor/Shape/Square";
import CONFIG from "./constants";

export interface IBlock extends Omit<IItem, "target" | "group" | "width" | "height"> {
}

export default class Block extends Square {
    public static readonly ONE_BLOCK = 0
    public static readonly LEFT_BLOCK_CLOSED = 1
    public static readonly RIGHT_BLOCK_CLOSED = 2
    public static readonly HORIZONTAL_BLOCK = 3
    public static readonly VERTICAL_BLOCK = 14
    public static readonly LEFT_TOP_BLOCK_OPEN = 5
    public static readonly RIGHT_TOP_BLOCK_OPEN = 6
    public static readonly MIDDLE_TOP_BLOCK_OPEN = 7
    public static readonly MIDDLE_OPEN = 8
    public static readonly RIGHT_MIDDLE_OPEN = 9
    public static readonly LEFT_MIDDLE_OPEN = 10
    public static readonly LEFT_BOTTOM_OPEN = 11
    public static readonly MIDDLE_BOTTOM_OPEN = 12
    public static readonly RIGHT_BOTTOM_OPEN = 13

    constructor(data: IBlock) {
        super({ 
            ...data, 
            textureId: "block",
            width: CONFIG.SIZE, 
            height: CONFIG.SIZE, 
            frame: data.frame && { ...data.frame, columns: 5, size: 50 },
            group: [Block] 
        })

        this.fill = "#420"
    }
}
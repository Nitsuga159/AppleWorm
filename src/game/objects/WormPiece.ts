import game from "../game";
import { IItem } from "../../motor/Items/IItem";
import Square from "../../motor/Shape/Square";
import Apple from "./Apple";
import Block from "./Block";
import Stone from "./Stone";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import Hole from "./Hole";
import BaseObject from "./BaseObject";
import Canvas from "../../motor/Canvas";

export default class WormPiece extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({
            ...data,
            paintPriority: 71,
            width: CONFIG.SIZE,
            height: CONFIG.SIZE,
            frame: { index, textureId: "worm", columns: 2, frameSize: 50, spin },
            group: [WormPiece],
            target: [Stone, Block, Apple, Hole]
        })
    }

    public update(): void {

    }

    public copy(): WormPiece {
        return new WormPiece({
            x: this.getX(),
            y: this.getY(),
            index: this.getFrameProperty("index"),
            spin: this.getFrameProperty("spin")
        })
    }

    public getSide(head: WormPiece, hole: Hole): { dir: "LEFT" | "RIGHT" | "BOTTOM" | "TOP", hole: [number, number]} {
        if (head.getX() - hole.getX() < 0) return { dir: "LEFT", hole: [3 * Math.PI / 2, Math.PI / 2]};
        if (head.getX() - hole.getX() > 0) return { dir: "RIGHT", hole: [Math.PI / 2, 3 * Math.PI / 2]};
        if (head.getY() - hole.getY() < 0) return { dir: "TOP", hole: [0, Math.PI]};
        
        return { dir: "BOTTOM", hole: [Math.PI, Math.PI * 2]};
    }

    paint(ctx: CanvasRenderingContext2D): void {

        if (game.getWonPiece() && this.last) {
            const pieces = game.getWonPiece()!.slice(0, -2)
            const hole = pieces.at(-1) as Hole

            ctx.beginPath();

            const { dir, hole: holeShape } = this.getSide(pieces.at(-2)! as WormPiece, hole)
            ctx.arc(hole.getX() + 25, hole.getY() + 25, 30, ...holeShape);
            const frameY = this.getFrameProperty("frameY")! + (this.getFrameProperty("delY") || 0)
            const frameX = this.getFrameProperty("frameX")! + (this.getFrameProperty("delX") || 0)
            const frameSize = this.getFrameProperty("frameSize")

            if (dir === "LEFT") {
                ctx.lineTo(hole.getX() + 25, frameY + frameSize)
                ctx.lineTo(frameX - 1, frameY + frameSize)
                ctx.lineTo(frameX - 1, frameY)
                ctx.lineTo(frameX + frameSize, frameY)
            } else if(dir === "RIGHT") {
                ctx.lineTo(hole.getX() + 25, frameY)
                ctx.lineTo(frameX + frameSize + 1, frameY)
                ctx.lineTo(frameX + frameSize + 1, frameY + frameSize + 5)
                ctx.lineTo(frameX, frameY + frameSize + 5)
            } else if(dir === "TOP") {
                ctx.lineTo(frameX, hole.getY() + 25)
                ctx.lineTo(frameX, frameY - 1)
                ctx.lineTo(frameX + frameSize, frameY)
                ctx.lineTo(frameX + frameSize, frameY + frameSize)
            } else {
                ctx.lineTo(frameX + frameSize, hole.getY() + 25)
                ctx.lineTo(frameX + frameSize, frameY)
                ctx.lineTo(frameX + frameSize, frameY + frameSize + 1)
                ctx.lineTo(frameX, frameY + frameSize + 1)
            }

            ctx.closePath()
            ctx.clip();
        }

        super.paint(ctx)
    }
}
import game from "../game";
import Apple from "./Apple";
import Block from "./Block";
import Stone from "./Stone";
import CONFIG from "../constants";
import { IPSeudoItem } from "../interfaces/IPseudoItem";
import Hole from "./Hole";
import BaseObject from "./BaseObject";
import GameMap from "../../motor/GameMap";

export default class WormPiece extends BaseObject {
    constructor({ index, spin, ...data }: IPSeudoItem) {
        super({
            ...data,
            paintPriority: 98,
            canMove: false,
            canRotate: false,
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
        const copy = super.copy() as WormPiece

        copy.setFrameProperty("index", this.getFrameProperty("index"))
        copy.setFrameProperty("spin", this.getFrameProperty("spin"))

        return copy
    }

    public getSide(head: WormPiece, hole: Hole): { dir: "LEFT" | "RIGHT" | "BOTTOM" | "TOP", hole: [number, number] } {
        if (head.getX() - hole.getX() < 0) return { dir: "LEFT", hole: [3 * Math.PI / 2, Math.PI / 2] };
        if (head.getX() - hole.getX() > 0) return { dir: "RIGHT", hole: [Math.PI / 2, 3 * Math.PI / 2] };
        if (head.getY() - hole.getY() < 0) return { dir: "TOP", hole: [0, Math.PI] };

        return { dir: "BOTTOM", hole: [Math.PI, Math.PI * 2] };
    }

    paint(ctx: CanvasRenderingContext2D): void {
        //mask to hole
        if (game.getWonPiece() && this.last) {
            const pieces = game.getWonPiece()!.slice(0, -2)
            const hole = pieces.at(-1) as Hole

            ctx.beginPath();

            const { dir, hole: holeShape } = this.getSide(pieces.at(-2)! as WormPiece, hole)
            const radio = CONFIG.SIZE / 2
            const holeRadio = hole.getFrameProperty("frameSize") / 2

            ctx.arc(hole.getX() + radio, hole.getY() + radio, holeRadio, ...holeShape);

            const frameY = this.getFrameProperty("frameY")! + (this.getFrameProperty("delY") || 0)
            const frameX = this.getFrameProperty("frameX")! + (this.getFrameProperty("delX") || 0)
            const frameSize = this.getFrameProperty("frameSize")

            if (dir === "LEFT") {
                ctx.lineTo(hole.getX() + radio, frameY + frameSize)
                ctx.lineTo(frameX, frameY + frameSize)
                ctx.lineTo(frameX, frameY)
                ctx.lineTo(frameX + frameSize, frameY)
            } else if (dir === "RIGHT") {
                ctx.lineTo(hole.getX() + radio, frameY)
                ctx.lineTo(frameX + frameSize, frameY)
                ctx.lineTo(frameX + frameSize, frameY + frameSize)
                ctx.lineTo(frameX, frameY + frameSize)
            } else if (dir === "TOP") {
                ctx.lineTo(frameX, hole.getY() + radio)
                ctx.lineTo(frameX, frameY)
                ctx.lineTo(frameX + frameSize, frameY)
                ctx.lineTo(frameX + frameSize, frameY + frameSize)
            } else {
                ctx.lineTo(frameX + frameSize, hole.getY() + radio)
                ctx.lineTo(frameX + frameSize, frameY)
                ctx.lineTo(frameX + frameSize, frameY + frameSize)
                ctx.lineTo(frameX, frameY + frameSize)
            }


            // //Uncomment if you don't understand sh*t
            // ctx.strokeStyle = "red"
            // ctx.lineWidth = 4
            // ctx.stroke()

            ctx.closePath()
            ctx.clip();
        }

        super.paint(ctx)
    }

    public onWormHeadCollide(_: WormPiece, __: GameMap): boolean {
        return false
    }
}
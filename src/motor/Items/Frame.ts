import { Class } from "../../game/interfaces/Class";
import BaseItem from "./BaseItem";
import { IBounds } from "./IBaseItem";

export interface IFrame {
  textureId?: string;
  index: number;
  frameSize: number;
  totalFrames?: number
  frameHeight?: number
  frameWidth?: number
  columns?: number
  rows?: number
  delX?: number
  delY?: number
  flip?: boolean
  spin?: number
  syncLocation?: boolean
  frameX?: number
  frameY?: number
}

export interface IFrameConstructor extends IBounds {
  frame?: IFrame;
}

function Frame<TBase extends Class<BaseItem>>(Base: TBase) {
  return class extends Base {
    private texture?: HTMLImageElement
    private textureId?: string
    private spin: number
    private index: number
    private delX: number
    private delY: number
    private totalFrames: number
    private rows: number
    private columns: number
    private frameWidth?: number
    private frameHeight?: number
    private frameSize: number
    private flip: boolean
    private syncLocation: boolean
    private frameX: number
    private frameY: number
    private increment = 1

    constructor(...args: any[]) {
      const { frame, ...data } = args[0] as { frame: IFrame };
      super(data);

      if (frame?.textureId) {
        this.textureId = frame.textureId
        this.texture = document.getElementById(frame.textureId) as HTMLImageElement;
      }

      this.index = frame.index
      this.spin = frame.spin || 0
      this.delX = frame.delX || 0
      this.delY = frame.delY || 0
      this.columns = frame.columns || 1
      this.rows = frame.rows || 1
      this.totalFrames = frame.totalFrames ?? 1
      this.frameSize = frame.frameSize
      this.frameWidth = frame.frameWidth
      this.frameHeight = frame.frameHeight
      this.flip = frame.flip ?? false
      this.syncLocation = frame.syncLocation ?? true
      this.frameX = frame.frameX ?? this.getX()
      this.frameY = frame.frameY ?? this.getY()
    }

    public drawFrame() {
    }

    public getFrameProperty<K extends keyof IFrame>(key: K): IFrame[K] {
      return (this as unknown as IFrame)[key]
    }

    public setFrameProperty<K extends keyof IFrame>(key: K, value: IFrame[K]): void {
      (this as unknown as IFrame)[key] = value

      if(key === "syncLocation" && value === false) {
        this.frameX = this.getX()
        this.frameY = this.getY()
      }
    }

    public getFrameCoordinates() {
      if (!this.texture) return null;

      const x = ((this.index - 1) % this.columns) * this.frameSize;
      const y = Math.floor((this.index - 1) / this.columns) * this.frameSize;
      return { x, y };
    }

    public nextFrame() {
      if (this.texture) {
        this.index = (this.index % this.totalFrames) + 1
      }
    }

    public rotate() {
      if (this.texture) {
        this.spin = (this.spin + 90) % 360
      }
    }

    public nextFrameWithReverse() {
      if (this.texture) {
        if (this.index === 1) {
          this.increment = 1
        } else if (this.index === this.totalFrames) {
          this.increment = -1
        }

        this.index += this.increment
      }
    }

    public paintFrame(ctx: CanvasRenderingContext2D) {
      if (!this.texture) return;

      const dx = this.syncLocation ? this.getX() : this.frameX;
      const dy = this.syncLocation ? this.getY() : this.frameY;
      const angle = this.spin * Math.PI / 180;  // Convertir grados a radianes

      ctx.save();

      ctx.translate((dx + this.frameSize / 2) + this.delX, (dy + this.frameSize / 2) + this.delY);

      if (angle) {
        ctx.rotate(angle);
      }

      if (this.flip) {
        ctx.scale(-1, 1);
      }

      const { x, y } = this.getFrameCoordinates()!

      ctx.drawImage(this.texture, x, y, this.frameSize, this.frameSize, -this.frameSize / 2, -this.frameSize / 2, this.frameSize, this.frameSize);

      ctx.restore()
    }
  };
}

export default Frame;

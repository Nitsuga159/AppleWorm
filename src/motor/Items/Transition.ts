export default class Transition {
    private currentFrame = 0
    private frames: number
    private from: number
    private to: number
    private cb: (value: number, percent: number) => void
    private onEnd: () => void

    constructor({ frames, from, to, cb, onEnd }: { frames: number, from: number, to: number, cb: (value: number, percent: number) => void, onEnd: () => void }) {
        this.frames = frames
        this.from = from
        this.to = to
        this.cb = cb
        this.onEnd = onEnd
    }

    update() {
        if(!this.isEnd()) {
            this.cb(
                (this.to - this.from) / this.frames,
                this.currentFrame / this.frames
            )

            this.currentFrame++

            if(this.isEnd()) {
                this.onEnd()
            }
        }
    }

    isEnd() {
        return this.currentFrame >= this.frames
    }
}
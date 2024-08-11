import MouseMove from "../motor/Functions/MouseMove/MouseMove";
import GameMap from "../motor/GameMap";
import BaseItem from "../motor/Items/BaseItem";
import BaseObject from "./objects/BaseObject";
import Worm from "./Worm";
import WormPiece from "./objects/WormPiece";
import CONFIG from "./constants";
import Canvas from "../motor/Canvas";
import Start from "./objects/non-interactive/Start";
import Flash from "./objects/non-interactive/Flash";
import { IPSeudoItem } from "./interfaces/IPseudoItem";
import { Class } from "./interfaces/Class";
import { Object } from "./interfaces/types";
import { ILocationArray } from "../motor/Items/IBaseItem";

export interface JSONCoords {
    name: string,
    resolution?: {
        width: number,
        height: number
    },
    items: { [key: string]: { x: number, y: number, index: number, spin?: number, flip?: boolean }[] }
}

export enum MODE {
    EDITOR,
    NORMAL,
    NONE
}

export class WormGame extends GameMap {
    private mode: MODE = MODE.NONE
    private name?: string
    private worm?: Worm
    private json?: JSONCoords
    private stop: boolean = false
    private wonPiece: BaseObject[] | null = null

    constructor() {
        super()

        this.add(Flash)
    }

    resizeCanvas() {
        const canvas = Canvas.getCanvas()
        const aspectRatio = canvas.width / canvas.height;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
    
        let newWidth, newHeight;
    
        if (windowWidth / windowHeight < aspectRatio) {
            newWidth = windowWidth;
            newHeight = newWidth / aspectRatio;
        } else {
            newHeight = windowHeight;
            newWidth = newHeight * aspectRatio;
        }
    
        // Ajusta el tamaño del canvas
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }

    public setWonPiece(piece: BaseObject[]) {
        this.wonPiece = piece
    }

    public getWonPiece() {
        return this.wonPiece
    }

    public getLoadedJSON() {
        return this.json
    }

    public setStop(stop: boolean) {
        this.stop = stop

        return this
    }

    public getStop() {
        return this.stop
    }

    public loadJSON(json: JSONCoords, gameObjects: Object<Class<BaseObject>>) {
        Flash.setOnHalf(() => {
            if (Object.keys(json.items).some(itemName => typeof gameObjects[itemName] === "undefined")) throw new Error("Invalid items")
            if (!json.items["worm"]) throw new Error("Worm is not defined")

            if (json.resolution) {
                if(json.resolution.width > 3000 || json.resolution.height > 2000 || json.resolution.width < 300 || json.resolution.height < 300) {
                    throw new Error("Invalid resolution")
                }

                Canvas.getCanvas().width = json.resolution.width
                Canvas.getCanvas().height = json.resolution.height
            } else {
                Canvas.getCanvas().width = 1280
                Canvas.getCanvas().height = 720
            }

            Object.values(gameObjects).forEach(v => (v as unknown as typeof BaseObject).resetAllItems())
            this.get().forEach(v => v.automaticRemove() && this.remove(v))
            this.stop = false
            this.wonPiece = null

            this.name = json.name

            const coords: any = {}
            for (let itemKey in json.items) {
                for (let { x, y } of json.items[itemKey]) {
                    if (coords[x + "-" + y]) {
                        throw new Error("Has repeated coords")
                    } else {
                        coords[x + "-" + y] = 1
                    }

                    if(parseInt(x.toString()) !== x || parseInt(y.toString()) !== y) {
                        throw new Error("Invalid coords")
                    }
                }
            }

            for (let itemKey in json.items) {
                if (itemKey === "worm") {
                    continue;
                }

                for (let { x, y, index, spin, flip } of json.items[itemKey]) {
                    const item = new gameObjects[itemKey]({ x, y, index, spin, flip })

                    if (this.mode === MODE.EDITOR && item.getCanMove()) {
                        const instance = new MouseMove({
                            target: item, encapsulate: true, onNewLocation: (n) => {
                                if (game.get().some(i => BaseItem.matchLocation((WormGame.roundCoords([n.x, n.y]) as [number, number]), i.getLocation()))) {
                                    item.setLocation(instance.getPrevLocation().x, instance.getPrevLocation().y)
                                } else {
                                    item.setLocation(...(WormGame.roundCoords([n.x, n.y]) as [number, number]))
                                }
                            }
                        })
                    }

                    this.add(item)
                }
            }

            this.resizeCanvas()
            this.add(new Start())
            this.add(new Start())
            this.add(new Start())
            this.add(new Start())
            this.worm = new Worm(json.items["worm"].map(i => new WormPiece(i as IPSeudoItem)))
            this.json = json

            this.setStop(false)
        })
        
        Flash.start()

        return this
    }

    public getWorm() {
        return this.worm
    }

    public setWorm(worm: Worm) {
        this.worm = worm
    }

    getItemJSON(itemConstructor: Class<BaseObject>) {
        return (itemConstructor as unknown as typeof BaseObject).getAllItems().map(i => {
            const item = { x: i.getX() / CONFIG.SIZE, y: i.getY() / CONFIG.SIZE, index: i.getFrameProperty("index") } as any

            if (i.getFrameProperty("spin")) {
                item.spin = i.getFrameProperty("spin")
            }

            if (i.getFrameProperty("flip")) {
                item.flip = i.getFrameProperty("flip")
            }

            return item
        })
    }

    getJSON(gameObjects: Object<Class<BaseObject>>) {
        const json: JSONCoords = { name: this.name!, resolution: { width: Canvas.getCanvas().width, height: Canvas.getCanvas().height }, items: {} }

        Object.keys(gameObjects).forEach(key => json.items[key] = this.getItemJSON(gameObjects[key]))

        return json
    }

    public getFrom(location: ILocationArray) {
        for (let item of this.get()) {
            if (BaseItem.matchLocation(WormGame.floorCoords(location), WormGame.floorCoords(item.getLocation())) && item instanceof BaseObject) {
                return item
            }
        }

        return null
    }

    public getMode() {
        return this.mode
    }

    public setMode(mode: MODE) {
        this.mode = mode
    }

    public getName() {
        return this.name
    }

    public static floorCoord(n: number) {
        return Math.floor(n / CONFIG.SIZE) * CONFIG.SIZE
    }

    public static roundCoord(n: number) {
        return Math.round(n / CONFIG.SIZE) * CONFIG.SIZE
    }

    public static roundCoords([x, y]: ILocationArray): ILocationArray {
        return [this.roundCoord(x), this.roundCoord(y)]
    }

    public static floorCoords([x, y]: ILocationArray): ILocationArray {
        return [this.floorCoord(x), this.floorCoord(y)]
    }

    public setName(name: string) {
        this.name = name
    }
}

const game = new WormGame()

export default game
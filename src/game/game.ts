import MouseMove from "../motor/Functions/MouseMove/MouseMove";
import GameMap from "../motor/GameMap";
import BaseItem from "../motor/Items/BaseItem";
import Item from "../motor/Items/Item";
import Loop from "../motor/Loop";
import BaseObject from "./objects/BaseObject";
import Worm from "./Worm";
import WormPiece from "./objects/WormPiece";
import CONFIG from "./constants";
import { IPSeudoItem } from "./interfaces/IPseudoItem";

export interface JSONCoords {
    name: string,
    items: { [key: string]: {x: number, y: number, index: number, spin?: number, flip?: boolean }[] }
}

export enum MODE {
    EDITOR,
    NORMAL
}

export class WormGame extends GameMap {
    private mode: MODE = MODE.NORMAL
    private name?: string
    private worm?: Worm
    private json?: JSONCoords
    private stop: boolean = false
    private wonPiece: BaseObject[] | null = null

    public setWonPiece(piece: BaseObject[]) {
        this.wonPiece = piece
    }

    public getWonPiece(){
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

    public loadJSON(json: JSONCoords, gameObjects: any) {
        if(Object.keys(json.items).some(itemName => typeof gameObjects[itemName] === "undefined")) throw new Error("Invalid items")
        if(!json.items["worm"]) throw new Error("Worm is not defined") 

        this.name = json.name

        const coors: any = {}
        for(let itemKey in json.items) {
            for(let { x, y } of json.items[itemKey]) {
                if(coors[x + "-" + y]) {
                    throw new Error("Has repeated coords")
                } else {
                    coors[x + "-" + y] = 1
                }

                if(x % CONFIG.SIZE !== 0 || y % CONFIG.SIZE !== 0) {
                    throw new Error("Invalid size coords")
                }
            }
        }

        for(let itemKey in json.items) {
            if(itemKey === "worm") {
                continue;
            }

            for(let { x, y, index, spin, flip } of json.items[itemKey]) {
                const item = new gameObjects[itemKey]({ x, y, index, spin, flip })

                if(this.mode === MODE.EDITOR) {
                    const instance = new MouseMove({ target: item, encapsulate: true, onNewLocation: (n) => {
                        if(game.get().some(i => BaseItem.matchLocation((WormGame.roundCoords([n.x, n.y]) as [number, number]), i.getLocation()))) {
                            item.setLocation(instance.getPrevLocation().x, instance.getPrevLocation().y)
                        } else {
                            item.setLocation(...(WormGame.roundCoords([n.x, n.y]) as [number, number]))
                        }
                    } })
                }

                this.add(item)
            }
        }

        this.worm = new Worm(json.items["worm"].map(i => new WormPiece(i as IPSeudoItem)))
        this.json = json

        return this
    }

    public getWorm() {
        return this.worm
    }

    public setWorm(worm: Worm) {
        this.worm = worm
    }

    getItemJSON(itemConstructor: typeof Item) {
        return itemConstructor.getAllItems().map(i => {
            const item = { x: i.getX(), y: i.getY(), index: i.getFrameProperty("index") } as any

            if(i.getFrameProperty("spin")) {
                item.spin = i.getFrameProperty("spin")
            }

            if(i.getFrameProperty("flip")) {
                item.flip = i.getFrameProperty("flip")
            }

            return item
        })
    }

    getJSON(gameObjects: any) {
        const json: JSONCoords = { name: this.name!, items: {} }

        Object.keys(gameObjects).forEach(key => json.items[key] = this.getItemJSON(gameObjects[key]))

        return json
    }

    public getFrom(location: [x: number, y: number]) {
        for(let item of this.get()) {
            if(BaseItem.matchLocation(WormGame.floorCoords(location), WormGame.floorCoords(item.getLocation()))) {
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

    public static roundCoords([x, y]: number[]): [x: number, y: number] {
        return [this.roundCoord(x), this.roundCoord(y)]
    }

    public static floorCoords([x, y]: number[]): [x: number, y: number] {
        return [this.floorCoord(x), this.floorCoord(y)]
    }
}

const game = new WormGame()

export default game
import GameMap from "../motor/GameMap";
import { IBounds } from "../motor/Items/IBaseItem";
import { IFrame } from "../motor/Items/IItem";
import Worm from "./Worm";
import WormPiece from "./WormPiece";
import CONFIG from "./constants";

export interface JSONCoords {
    name: string,
    items: { [key: string]: {x: number, y: number, frame: IFrame }[] }
}

class WormGame extends GameMap {
    public gravityEnabled = true
    private worm: Worm | undefined

    public loadJSON(json: JSONCoords, gameObjects: any) {
        if(Object.keys(json.items).some(itemName => typeof gameObjects[itemName] === "undefined")) throw new Error("Invalid items")
        if(!json.items["worm"]) throw new Error("Worm is not defined") 

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

            for(let { x, y, frame } of json.items[itemKey]) {
                this.add(new gameObjects[itemKey]({ x, y, frame } as any))
            }
        }

        this.worm = new Worm(json.items["worm"].map(i => new WormPiece(i)))
    }

    public getWorm() {
        return this.worm
    }
}

const game = new WormGame()

export default game
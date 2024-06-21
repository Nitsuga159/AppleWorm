import Apple from "./game/Apple";
import Block from "./game/Block";
import Skewers from "./game/Skewers";
import Stone from "./game/Stone";
import Worm from "./game/Worm";
import WormPiece from "./game/WormPiece";
import game from "./game/game";
import GAME_OBJETS from "./game/gameObjects";
import Canvas from "./motor/Canvas";
import EventController from "./motor/EventController";
import Gravity from "./motor/Functions/Gravity/Gravity";
import MouseMove from "./motor/Functions/MouseMove/MouseMove";
import BaseItem from "./motor/Items/BaseItem";
import Square from "./motor/Shape/Square";

game.loadItemConstructor(Block, Stone, WormPiece, Skewers, Apple)


Canvas.init({ id: "root", width: 1920, height: 1080 })

game.loadJSON({
    name: "xd", items: {
        worm: [
            { x: 100, y: 200, frame: { index: 1, size: 55 } },
            { x: 50, y: 200, frame: { index: 1, size: 55 } },
            { x: 0, y: 200, frame: { index: 1, size: 55 } },
            { x: -50, y: 200, frame: { index: 1, size: 55 } },
        ],
        apple: [
            { x: 200, y: 150, frame: { index: 1, size: 55, delX: -2, delY: -2 } }],
        block: [
            { x: 50, y: 250, frame: { index: 3, size: 55 } },
            { x: 100, y: 250, frame: { index: 15, size: 55 } },
            { x: 150, y: 250, frame: { index: 2, size: 55 } },
            
            { x: 50, y: 450, frame: { index: 3, size: 55 } },
            { x: 100, y: 450, frame: { index: 2, size: 55 } },
           
            { x: 200, y: 450, frame: { index: 3, size: 55 } },
            { x: 250, y: 450, frame: { index: 7, size: 55 } },
            { x: 250, y: 400, frame: { index: 14, size: 55 } },
            { x: 300, y: 400, frame: { index: 2, size: 55 } },
            
            { x: 350, y: 250, frame: { index: 1, size: 55 }, },


            { x: 450, y: 250, frame: { index: 5, size: 55 }, },
            { x: 500, y: 250, frame: { index: 17, size: 55 }, },
            { x: 550, y: 250, frame: { index: 4, size: 55 }, },

            { x: 450, y: 300, frame: { index: 10, size: 55 }, },
            { x: 500, y: 300, frame: { index: 8, size: 55 }, },
            { x: 550, y: 300, frame: { index: 9, size: 55 }, },

            { x: 450, y: 350, frame: { index: 10, size: 55 }, },
            { x: 500, y: 350, frame: { index: 8, size: 55 }, },
            { x: 550, y: 350, frame: { index: 9, size: 55 }, },

            { x: 450, y: 400, frame: { index: 21, size: 55 }, },
            { x: 500, y: 400, frame: { index: 11, size: 55 }, },
            { x: 550, y: 400, frame: { index: 12, size: 55 }, },

            { x: 450, y: 100, frame: { index: 3, size: 55 }, },
            { x: 500, y: 100, frame: { index: 15, size: 55 }, },
            { x: 550, y: 100, frame: { index: 7, size: 55 }, },
            { x: 550, y: 50, frame: { index: 19, size: 55 }, },

            { x: 650, y: 150, frame: { index: 6, size: 55 }, },
            { x: 700, y: 150, frame: { index: 7, size: 55 }, },
            { x: 650, y: 100, frame: { index: 14, size: 55 }, },
            { x: 700, y: 100, frame: { index: 16, size: 55 }, },

            { x: 650, y: 300, frame: { index: 14, size: 55 }, },
            { x: 700, y: 300, frame: { index: 15, size: 55 }, },
            { x: 750, y: 300, frame: { index: 16, size: 55 }, },
            
            
            { x: 650, y: 350, frame: { index: 18, size: 55 }, },
            { x: 750, y: 350, frame: { index: 18, size: 55 }, },


            { x: 650, y: 400, frame: { index: 6, size: 55 }, },
            { x: 700, y: 400, frame: { index: 15, size: 55 }, },
            { x: 750, y: 400, frame: { index: 7, size: 55 }, },

        ],
        stone: [
            { x: 150, y: 0, frame: { index: 1, size: 60 } },
        ],
        skewers: [
            { x: 500, y: 200, frame: { index: 1, size: 50, delY: 10 } },
            { x: 550, y: 200, frame: { index: 1, size: 50, delY: 10  } },
            { x: 250, y: 350, frame: { index: 1, size: 50, delY: 10  } },
        ]
    }
}, GAME_OBJETS)
const worm = game.getWorm()!

const map: { [key: string]: number } = {
    "ArrowLeft": -50,
    "ArrowRight": 50,
    "ArrowUp": -50,
    "ArrowDown": 50,
}

document.addEventListener("keydown", async (e) => {
    if (typeof map[e.key] === "undefined") return;
    if (worm.isMoving()) return;
    if (worm.isFalling()) return;

    const plus = (map as any)[e.key];


    const newX = (e.key === "ArrowLeft" || e.key === "ArrowRight" ? plus : 0)
    const newY = (e.key === "ArrowUp" || e.key === "ArrowDown" ? plus : 0)
    const headCube = worm.getHead()
    const [headX, headY] = headCube.getLocation()
    for (let s of worm.getQueue()) {
        if (s.getX() === headX + newX && s.getY() === headY + newY) return;
    }

    let appleItem: Apple | null = null;
    Apple.getAllItems()?.forEach(
        (item) => {
            const nextLocation = headCube.getLocation()
            nextLocation[0] += newX
            nextLocation[1] += newY


            if (BaseItem.matchLocation(nextLocation, item.getLocation())) {
                worm.enlarge()
                appleItem = item as Apple
            }
        }
    )

    if (newX && !(await worm.canMoveX(newX))) return;
    if (newY && !(await worm.canMoveY(newY))) return;

    let prev: number[] = [headX, headY]

    newX ? headCube.setTransitionX(headX + plus) : headCube.setTransitionY(headY + plus)

    worm.getQueue().forEach((s) => {
        let aux = s.getLocation()
        s.setTransitionX(prev[0], () => {
            if (appleItem) game.remove(appleItem)
        })
        s.setTransitionY(prev[1], () => {
            if (appleItem) game.remove(appleItem)
        })
        prev = aux
    })
})

const move = new MouseMove({ baseItem: Block.getAllItems()![0], encapsulate: true })

// setTimeout(() => {
//     move.disable()
//     setTimeout(() => {
//         move.enable()
//     }, 3000)
// }, 3000)

game.execute(() => {
    Skewers.checkCollision(worm)
    worm.checkCollision()
})
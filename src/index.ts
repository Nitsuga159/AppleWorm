import Apple from "./game/objects/Apple";
import BaseObject from "./game/objects/BaseObject";
import Block from "./game/objects/Block";
import Cloud from "./game/objects/Cloud";
import Hole from "./game/objects/Hole";
import Menu from "./game/Menu";
import Skewers from "./game/objects/Skewers";
import Stone from "./game/objects/Stone";
import WormPiece from "./game/objects/WormPiece";
import CONFIG from "./game/constants";
import game, { MODE, WormGame } from "./game/game";
import GAME_OBJETS from "./game/gameObjects";
import Canvas from "./motor/Canvas";
import EventController from "./motor/EventController";
import MouseMove from "./motor/Functions/MouseMove/MouseMove";
import BaseItem from "./motor/Items/BaseItem";

game.loadItemConstructor(Block, Stone, WormPiece, Skewers, Apple, Hole, Cloud)

Canvas.init({ id: "root", width: 1200, height: 720 })

const map: { [key: string]: number } = {
    "ArrowLeft": -50,
    "ArrowRight": 50,
    "ArrowUp": -50,
    "ArrowDown": 50,
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
        const item = menu.getGameSelectedItem()

        if (item) {
            game.remove(item)
        }

        return;
    }

    if (e.key === "g") {
        const item = menu.getGameSelectedItem()

        if (item) {
            item.rotate()
        }

        return;
    }

    const worm = game.getWorm()!
    if (game.getStop() || typeof map[e.key] === "undefined" || worm.isMoving() || worm.isFalling()) return;

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

    if (newX && !worm.canMoveX(newX)) return;
    if (newY && !worm.canMoveY(newY)) return;

    const isHole = game.getFrom([headCube.getX() + newX, headCube.getY() + newY])

    if (isHole instanceof Hole) {
        const reverseWorm: BaseObject[] = game.getWorm()!.getPieces().slice().reverse()
        const holeCopy = isHole.copy()
        const holeCopy2 = isHole.copy()
        reverseWorm.push(
            isHole, 
            holeCopy.setX(holeCopy.getX() + newX).setY(holeCopy.getY() + newY),
            holeCopy2.setX(holeCopy2.getX() + (newX * 2)).setY(holeCopy2.getY() + (newY * 2)),
        )

        game.setWonPiece(reverseWorm)

        reverseWorm.map((_, i) => reverseWorm.slice(i + 1).map(n => ({ x: n.getX(), y: n.getY() })))
            .forEach(
                (p, i) => reverseWorm[i].setChainTransition(p, () => {
                    worm.checkQueueFrame()
                    worm.checkEndFrame()
                })
            )

            worm.checkHeadFrame(
                [worm.getHead().getFrameProperty("frameX")!, worm.getHead().getFrameProperty("frameY")!],
                [worm.getHead().getNextX(), worm.getHead().getNextY()]
            )
            worm.checkQueueFrame()
            worm.checkEndFrame()

        return;
    }

    let prev: number[] = [headX, headY]

    if (newX) {
        headCube.setTransitionX(headX + plus, () => appleItem && game.remove(appleItem))
    } else {
        headCube.setTransitionY(headY + plus, () => appleItem && game.remove(appleItem))
    }

    worm.checkHeadFrame(
        headCube.getLocation(),
        [headCube.getNextX(), headCube.getNextY()]
    )

    worm.getQueue().forEach((s, index) => {
        let aux = s.getLocation()
        s.setTransitionX(prev[0], () => index === worm.getQueue().length - 1 && worm.setFalling(true))
        s.setTransitionY(prev[1], () => index === worm.getQueue().length - 1 && worm.setFalling(true))
        prev = aux
    })

    worm.checkQueueFrame()

    worm.checkEndFrame()
})

const menu = new Menu()

game.execute(() => {
    Skewers.checkCollision(game.getWorm()!)
    game.getWorm()?.checkCollision()
    game.get().sort((a, b) => a.getPaintPriority() > b.getPaintPriority() || (a.getY() < b.getY() && a.getPaintPriority() === b.getPaintPriority()) || (a.getX() > b.getX() && a.getPaintPriority() === b.getPaintPriority()) ? 1 : -1)
})

game.setMode(MODE.EDITOR)

EventController.addListener("mousedown", ({ clientX: x, clientY: y }) => {
    if (game.getMode() !== MODE.EDITOR) return;
    const gameItemSelected = game.getFrom(WormGame.floorCoords([x, y]))

    if (gameItemSelected && menu.getGameSelectedItem() === gameItemSelected) {
        menu.getGameSelectedItem()?.setIsDebug(false)
        menu.setGameSelectedItem(null)

        return;
    } else if (gameItemSelected) {
        menu.getGameSelectedItem()?.setIsDebug(false)
        gameItemSelected.setIsDebug(true)
        menu.setGameSelectedItem(gameItemSelected)
        return;
    }

    if (!menu.getSelectedItem()) return;

    const coords: [number, number] = [Math.floor(x / CONFIG.SIZE) * CONFIG.SIZE, Math.floor(y / CONFIG.SIZE) * CONFIG.SIZE]

    const { name, index } = menu.getSelectedItem()!.dataset

    const item = new GAME_OBJETS[name as string]({
        x: coords[0],
        y: coords[1],
        index: parseInt(index!),
    })

    const instance = new MouseMove({
        target: item,
        encapsulate: true,
        onNewLocation: (n) => {
            if (game.get().some(i => BaseItem.matchLocation((WormGame.roundCoords([n.x, n.y]) as [number, number]), i.getLocation()))) {
                item.setLocation(instance.getPrevLocation().x, instance.getPrevLocation().y)
            } else {
                item.setLocation(...(WormGame.roundCoords([n.x, n.y]) as [number, number]))
            }
        }
    })

    game.add(item)
})

//BUTTONS EXPORT - IMPORT

const exportButton = document.getElementById("export-button")
const importButton = document.getElementById("import-button")
const importFile = document.getElementById("import-file") as HTMLInputElement

exportButton?.addEventListener("click", () => {
    console.log(game.getJSON(GAME_OBJETS))
    const anchor = document.createElement("a")
    const blob = new Blob([JSON.stringify(game.getJSON(GAME_OBJETS))], { type: 'application/json' });

    anchor.href = URL.createObjectURL(blob)
    anchor.download = game.getName()! + ".json"

    anchor.click()

    URL.revokeObjectURL(anchor.href)
})

importButton?.addEventListener("click", () => importFile?.click())

importFile?.addEventListener("change", async () => {
    if(importFile.files?.length) {
        game.loadJSON(JSON.parse(await importFile.files![0].text()), GAME_OBJETS)
    }
})


//reload button
const reloadButton = document.getElementById("reload-button")

reloadButton?.addEventListener("click", () => {
    game.reset().loadJSON(game.getLoadedJSON()!, GAME_OBJETS).setStop(false)
})
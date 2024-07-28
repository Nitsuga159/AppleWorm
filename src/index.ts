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
import Worm from "./game/Worm";
import Start from "./game/objects/Start";

game.loadItemConstructor(Block, Stone, WormPiece, Skewers, Apple, Hole, Start)

Canvas.init({ id: "root", width: 1300, height: 820 })

const map: { [key: string]: number } = {
    "ArrowLeft": -50,
    "ArrowRight": 50,
    "ArrowUp": -50,
    "ArrowDown": 50,
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && menu.getGameSelectedItem() !== null) return game.remove(menu.getGameSelectedItem()!)
    if (e.key === "g" && menu.getGameSelectedItem() !== null) return menu.getGameSelectedItem()!.rotate()

    const worm = game.getWorm()!
    if (game.getStop() || typeof map[e.key] === "undefined" || worm.isMoving() || worm.isFalling()) return;

    const plus = (map as any)[e.key];
    const addX = (e.key === "ArrowLeft" || e.key === "ArrowRight" ? plus : 0)
    const addY = (e.key === "ArrowUp" || e.key === "ArrowDown" ? plus : 0)

    const headCube = worm.getHead()
    const [headX, headY] = headCube.getLocation()

    if (addY < 0 && worm.isVertical()) return;

    const item = game.getFrom([headX + addX, headY + addY]) as BaseObject

    if (item instanceof BaseObject) {
        const canPass = item.onCollide(headCube, game)

        if (!canPass) return;
    }

    if (!(item instanceof Hole)) {
        let prev: number[] = [headX, headY]

        headCube.setFrameProperty("syncLocation", false)

        if (addX) {
            headCube.setTransitionX(headX + plus, true, () => {
                if (item instanceof Apple) game.remove(item)
                headCube.setFrameProperty("syncLocation", true)
            })
        } else {
            headCube.setTransitionY(headY + plus, true, () => {
                if (item instanceof Apple) game.remove(item)
                headCube.setFrameProperty("syncLocation", true)
            })
        }

        worm.getQueue().forEach((s, index) => {
            s.setFrameProperty("syncLocation", false)
            let aux = s.getLocation()
            s.setTransitionX(prev[0], true, () => {
                index === worm.getQueue().length - 1 && !(item instanceof Skewers) && worm.setFalling(true)
                s.setFrameProperty("syncLocation", true)
            })
            s.setTransitionY(prev[1], true, () => {
                index === worm.getQueue().length - 1 && !(item instanceof Skewers) && worm.setFalling(true)
                s.setFrameProperty("syncLocation", true)
            })
            prev = aux
        })
        worm.checkHeadFrame(
            headCube.getLocation(),
            [headCube.getNextX(), headCube.getNextY()]
        )
    }

    worm.checkQueueFrame()
    worm.checkEndFrame()
})

const menu = new Menu()

game.add(new Start())

game.execute(() => {
    game.getWorm()?.checkCollision()
    Skewers.checkCollision()
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
            if (game.getFrom(WormGame.roundCoords([n.x, n.y]) as [number, number])) {
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
    const anchor = document.createElement("a")
    const blob = new Blob([JSON.stringify(game.getJSON(GAME_OBJETS))], { type: 'application/json' });

    anchor.href = URL.createObjectURL(blob)
    anchor.download = game.getName()! + ".json"

    anchor.click()

    URL.revokeObjectURL(anchor.href)
})

importButton?.addEventListener("click", () => importFile?.click())

importFile?.addEventListener("change", async () => {
    if (importFile.files?.length) {
        game.loadJSON(JSON.parse(await importFile.files![0].text()), GAME_OBJETS)
    }
})


//reload button
const reloadButton = document.getElementById("reload-button")

reloadButton?.addEventListener("click", () => {
    game.reset().loadJSON(game.getLoadedJSON()!, GAME_OBJETS).setStop(false)
})
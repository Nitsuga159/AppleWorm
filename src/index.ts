import Apple from "./game/objects/Apple";
import BaseObject from "./game/objects/BaseObject";
import Block from "./game/objects/Block";
import Hole from "./game/objects/Hole";
import menu from "./game/Menu";
import Skewers from "./game/objects/Skewers";
import Stone from "./game/objects/Stone";
import WormPiece from "./game/objects/WormPiece";
import CONFIG from "./game/constants";
import game, { MODE, WormGame } from "./game/game";
import GAME_OBJETS from "./game/gameObjects";
import Canvas from "./motor/Canvas";
import EventController from "./motor/EventController";
import MouseMove from "./motor/Functions/MouseMove/MouseMove"
import Start from "./game/objects/non-interactive/Start";
import Levels from "./game/Levels";
import { Object } from "./game/interfaces/types";
import Worm from "./game/Worm";
import HTML from "./game/UI/HTML";
import QuadTree from "./motor/Interactive/QuadTree";
import BaseItem from "./motor/Items/BaseItem";
import Square from "./motor/Shape/Square";
import TreeElement from "./motor/Interactive/TreeElement";
import Button from "./motor/Interactive/Button";
import Container from "./motor/Interactive/Container";

Canvas.init({ id: "root", width: 1280, height: 720 })

let gameInitialized = false

function initializeGame() {
    if (gameInitialized) return;

    gameInitialized = true

    game.loadItemConstructor(Block, Stone, WormPiece, Skewers, Apple, Hole, Start)

    // const tree = new QuadTree(new BaseItem({ x: 0, y: 0, width: 1280, height: 720 }), 4)
    const tree = new TreeElement({ x: 0, y: 0, width: 1280, height: 720 })

    EventController.addListener("click", ({ clientX, clientY }) => {
        const x = tree.findMatches([clientX, clientY]).at(-1)

        if(x instanceof Button) {
            x.onClick()
        }
    })

    let prev: Button | undefined

    EventController.addListener("mousemove", ({ clientX, clientY }) => {
        const x = tree.findLast([clientX, clientY])

        console.log(x?.getFill())

        if(x instanceof Button) {
            x.onMouseEnter()
            prev = x
        } else if(prev) {
            prev.onMouseLeave()
            prev = undefined
        }
    })

    const square4 = new Container({ width: 100, height: 80, x: 0, y: 0, fill: "yellow" })
    const square5 = new Button({ width: 800, height: 60, x: 10, y: 10, fill: "pink" })
    const square6 = new Button({ width: 20, height: 50, x: 15, y: 15, fill: "green" })

    game.add(square4)

    tree.addChild(square4)
    square4.addChild(square5)
    square4.addChild(square6)

    const map: Object<number> = {
        "ArrowLeft": -50,
        "ArrowRight": 50,
        "ArrowUp": -50,
        "ArrowDown": 50,
    }

    document.addEventListener("keydown", (e) => {
        const menuItem = menu.getGameSelectedItem()
        if (e.key === "Backspace" && menuItem !== null) {
            if (!(menuItem instanceof WormPiece)) return game.remove(menuItem!)

            const index = WormPiece.getAllItems().findIndex(v => v === menuItem)
            const items = WormPiece.getAllItems().splice(index)
            items.forEach(i => game.remove(i))
            Worm.orderFrames(WormPiece.getAllItems() as WormPiece[])
        }
        if (e.key === "g" && menuItem !== null && menuItem?.getCanRotate()) return menuItem!.rotate()

        const worm = game.getWorm()!
        if (!Levels.isHidden() || game.getStop() || typeof map[e.key] === "undefined" || worm.isMoving() || worm.isFalling() || game.getMode() === MODE.EDITOR) return;

        let plus = (map as any)[e.key];
        const addX = (e.key === "ArrowLeft" || e.key === "ArrowRight" ? plus : 0)
        const addY = (e.key === "ArrowUp" || e.key === "ArrowDown" ? plus : 0)

        const headCube = worm.getHead()
        const [headX, headY] = headCube.getLocation()

        if (addY < 0 && worm.isVertical()) return;

        const item = game.getFrom([headX + addX, headY + addY]) as BaseObject

        if (item instanceof BaseObject && !item.onWormHeadCollide(headCube, game)) {
            return;
        }

        if (!(item instanceof Hole)) {
            let prev: number[] = [headX, headY]
            headCube.setFrameProperty("syncLocation", false)

            if (addX) {
                const duplicated = headCube.copy().setLocation(headX + addX, headY + addY)
                duplicated.setOpacity(0)
                game.add(duplicated)

                headCube.setTransitionX(headX + plus, true, () => {
                    item instanceof Apple && game.remove(item)
                    headCube.setFrameProperty("syncLocation", true)
                    game.remove(duplicated)

                })
            } else {
                if (plus < 0) {
                    headCube.setFrameProperty("syncLocation", true)
                    headCube.setTransitionY(headY + plus, false, () => {
                        item instanceof Apple && game.remove(item)
                    })
                } else {
                    headCube.setTransitionY(headY + plus, true, () => {
                        item instanceof Apple && game.remove(item)
                        headCube.setFrameProperty("syncLocation", true)
                    })
                }
            }

            worm.getQueue().forEach((s, index) => {
                s.setFrameProperty("syncLocation", false)
                let aux = s.getLocation()
                const cb = () => {
                    index === worm.getQueue().length - 1 && !(item instanceof Skewers) && worm.setFalling(true)
                    s.setFrameProperty("syncLocation", true)
                }
                s.setTransitionX(prev[0], true, cb)
                s.setTransitionY(prev[1], true, cb)
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

    game.execute(() => {
        game.get().sort((a, b) => a.getPaintPriority() > b.getPaintPriority() || (a.getY() < b.getY() && a.getPaintPriority() === b.getPaintPriority()) || (a.getX() > b.getX() && a.getPaintPriority() === b.getPaintPriority()) ? 1 : -1)
        game.getWorm()?.update()

        if (game.getStop()) return;

        Skewers.hasCollision()

        if (game.getWorm()?.getPieces().every(p => p.getY() - 100 > Canvas.getCanvas().height)) {
            return game.setStop(true).loadJSON(game.getLoadedJSON()!, GAME_OBJETS)
        }
    })


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

        const coords = [Math.floor(x / CONFIG.SIZE), Math.floor(y / CONFIG.SIZE)]

        const { name, index } = menu.getSelectedItem()!.dataset

        const item = new GAME_OBJETS[name as string]({
            x: coords[0],
            y: coords[1],
            index: parseInt(index!),
        })

        if (item instanceof WormPiece && WormPiece.getAllItems().length > 1) {
            if (WormPiece.getAllItems().length === 2) {
                const last = WormPiece.getAllItems().at(-2) as WormPiece
                const x = last.getDistanceX(item)
                const y = last.getDistanceY(item)

                Worm.checkHeadFrame(last.getLocation(), [last.getX() + x, last.getY() + y], last)
            } else {
                const last = WormPiece.getAllItems().at(-2) as WormPiece
                const x = Math.abs(last.getDistanceX(item))
                const y = Math.abs(last.getDistanceY(item))

                if (x > 50 || y > 50 || (x !== 0 && y !== 0)) {
                    return WormPiece.getAllItems().splice(WormPiece.getAllItems().length - 1, 1)
                }

            }
            Worm.orderFrames(WormPiece.getAllItems() as WormPiece[])
        } else if (item instanceof Stone) {
            (item as Stone).getGravity().setIsEnabled(false)
        }

        if (item.getCanMove()) {
            const instance = new MouseMove({
                target: item,
                encapsulate: true,
                onNewLocation: (n) => {
                    if (game.getFrom(WormGame.roundCoords([n.x, n.y]))) {
                        item.setLocation(instance.getPrevLocation().x, instance.getPrevLocation().y)
                    } else {
                        item.setLocation(...(WormGame.roundCoords([n.x, n.y])))
                    }
                }
            })
        }

        game.add(item)
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    await HTML.injectHTML("menu")

    document?.addEventListener("click", async (e) => {
        if (!(e.target instanceof HTMLButtonElement)) return;

        if (e.target.matches("#start")) {
            game.setMode(MODE.NORMAL)
            menu.hide()
            Levels.show()
            initializeGame()
            HTML.getContainer().classList.add("display-none")
            HTML.removeHTML()
        } else if (e.target.matches("#editor")) {
            game.setMode(MODE.EDITOR)
            Levels.hide()
            await HTML.injectHTML("input")
        }
    })
    
    document.addEventListener("submit", (e) => {
        e.preventDefault()
        
        const data = e.target as any
        const width = parseInt(data.width.value)
        const height = parseInt(data.height.value)
        const name = data.name.value.toString()
        
        if(name.length <= 0 || name.length > 100 || width < 300 || height < 300 || width > 3000 || height > 2000) return;

        Canvas.getCanvas().width = width
        Canvas.getCanvas().height = height
        game.setName(name)
        game.resizeCanvas()
        menu.show()
        initializeGame()
        HTML.removeHTML()
        game.loadJSON({ name, resolution: { width, height }, items: { worm: [] } }, GAME_OBJETS)
        HTML.getContainer().classList.add("display-none")

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

    //RELOAD BUTTON
    const resetFunction = () => {
        if(game.getLoadedJSON()) {

            game.setStop(true).loadJSON(game.getLoadedJSON()!, GAME_OBJETS)
        }
    }
    document.getElementById("reload-button")?.addEventListener("click", ()=> game.getMode() !== MODE.NONE && resetFunction())
    document.addEventListener("keydown", (e) => e.key === "r" && game.getMode() !== MODE.NONE && resetFunction())

    //RESIZE CANVAS
    game.resizeCanvas();
    window.addEventListener('resize', game.resizeCanvas);

    document.getElementById("back-button")?.addEventListener("click", () => {
        Levels.hide()
        menu.hide()
        game.reset()
        HTML.injectHTML("menu")
        HTML.getContainer().classList.remove("display-none")
        game.setMode(MODE.NONE)
    })
})
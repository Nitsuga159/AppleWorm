import Apple from "./game/Apple";
import Block from "./game/Block";
import Skewers from "./game/Skewers";
import Stone from "./game/Stone";
import Worm from "./game/Worm";
import WormPiece from "./game/WormPiece";
import loop from "./game/loop";
import Canvas from "./motor/Canvas";
import Gravity from "./motor/Functions/Gravity/Gravity";
import Item from "./motor/Items/Item";
import Loop from "./motor/Loop";
import Square from "./motor/Shape/Square";

Canvas.init({ id: "root", width: 1000, height: 500 })

const pieces = ["green", "green", "green", "green", "green"]
    .map((fill, i) => 
        new WormPiece({ x: 0, y: i * 50, width: 50, height: 50, fill })
    )

const worm = new Worm(pieces);



[0, 1, 2, 3, 4, 5].map(i => loop.getContainer().addItem(
    new Block({ x: i * 50, y: 250, width: 50, height: 50, fill: "#420" })
));

[9, 10, 11, 12].map(i => loop.getContainer().addItem(
    new Block({ x: i * 50, y: 250, width: 50, height: 50, fill: "#420" })
))

pieces.forEach(c => loop.getContainer().addItem(c))
loop.getContainer().addItem(new Stone({ fill: "gray", x: 100, y: -700, width: 50, height: 50 }))
loop.getContainer().addItem(new Apple({ fill: "red", x: 350, y: 150, width: 50, height: 50 }))
loop.getContainer().addItem(new Skewers({ fill: "orange", x: 200, y: 200, width: 50, height: 50 }))

const map: { [key: string]: number } = {
    "ArrowLeft": -50,
    "ArrowRight": 50,
    "ArrowUp": -50,
    "ArrowDown": 50,
}

document.addEventListener("keydown", async (e) => {
    if (typeof map[e.key] === "undefined") return;
    if (!pieces.every(s => !s.isMoving())) return;
    if (worm.isFalling()) return;

    const plus = (map as any)[e.key];


    const newX = (e.key === "ArrowLeft" || e.key === "ArrowRight" ? plus : 0)
    const newY = (e.key === "ArrowUp" || e.key === "ArrowDown" ? plus : 0)
    const [headCube, ...queueCube] = pieces
    const [headX, headY] = headCube.getLocation()
    for (let s of queueCube) {
        if (s.getX() === headX + newX && s.getY() === headY + newY) return;
    }

    loop.forEachTarget(Apple.GROUP, (item) => {
        const next = headCube.copy().addX(newX).addY(newY)

        if(next.matchLocation(item)) {
            worm.enlarge()
            loop.getContainer().removeItem(item)
        }
    })
    if(newX && !(await worm.canMoveX(newX))) return;
    if(newY && !(await worm.canMoveY(newY))) return;

    let prev: number[] = [headX, headY]

    newX ? headCube.setTransitionX(headX + plus) : headCube.setTransitionY(headY + plus)

    queueCube.forEach((s) => {
        let aux = s.getLocation()
        s.setTransitionX(prev[0])
        s.setTransitionY(prev[1])
        prev = aux
    })
})

loop.execute(() => {
    Skewers.checkCollision(worm)

    worm.checkCollision(Block.GROUP | Stone.GROUP | Apple.GROUP)
})
import game from "./game";
import GAME_OBJETS from "./gameObjects";

const d = document

class Levels {
    public static readonly PASS = 15
    public static readonly TOTAL_LEVELS = 30
    public static readonly LEVELS_ROUTE = "assets/levels/"
    private page = 0
    private listLevelsButton: HTMLButtonElement
    private buttonsContainer: HTMLDivElement
    private buttons: HTMLButtonElement[];

    constructor() {
        this.buttonsContainer = d.getElementById("grid-container") as HTMLDivElement
        this.listLevelsButton = d.getElementById("list-button") as HTMLButtonElement

        if (!this.buttonsContainer) {
            throw new Error("grid-container not found")
        }

        this.buttons = new Array(Levels.TOTAL_LEVELS).fill(1).map((_, index) => {
            const button = d.createElement("button")
            button.dataset.level = (index + 1).toString()
            button.textContent = (index + 1).toString()
            return button
        })

        const fragment = d.createDocumentFragment()

        this.buttons.slice(this.page * Levels.PASS, this.page * Levels.PASS + Levels.PASS).forEach(b => fragment.appendChild(b))

        this.buttonsContainer.appendChild(fragment)

        this.buttonsContainer.addEventListener("click", (e) => {
            const button = e.target as HTMLButtonElement

            if (button instanceof HTMLButtonElement) {
                const level = parseInt(button.dataset.level as string)

                fetch(`${Levels.LEVELS_ROUTE}/level-${level}.json`)
                    .then(res => res.json())
                    .then(json => game.loadJSON(json, GAME_OBJETS))

                this.hide()
            }
        })

        this.listLevelsButton.addEventListener("click", () => this.isHidden() ? this.show() : this.hide())
        d.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft" && this.page > 0) {
                this.page--
            } else if (e.key === "ArrowRight" && this.page * Levels.PASS + Levels.PASS < Levels.TOTAL_LEVELS) {
                this.page++
            } else {
                return;
            }
            this.buttonsContainer.innerHTML = ""
            const fragment = d.createDocumentFragment()

            this.buttons.slice(this.page * Levels.PASS, this.page * Levels.PASS + Levels.PASS).forEach(b => fragment.appendChild(b))

            this.buttonsContainer.appendChild(fragment)
        })
    }

    public hide() {
        this.buttonsContainer.classList.remove("show")
        this.buttonsContainer.classList.add("hidden")
    }

    public show() {
        this.buttonsContainer.classList.remove("hidden")
        this.buttonsContainer.classList.add("show")
    }

    public isHidden() {
        return this.buttonsContainer.classList.contains("hidden")
    }
}

export default new Levels()
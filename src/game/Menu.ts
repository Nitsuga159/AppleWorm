import Item from "../motor/Items/Item"
import IMAGES from "./images"

export default class Menu {
    private menu: HTMLDivElement
    private menuItems: HTMLDivElement
    private menuButton: HTMLDivElement
    private prevX = 0
    private prevY = 0
    private closed = true
    private mousePress = false
    private selectedItem?: HTMLImageElement
    private gameItemSelected: Item | null = null

    constructor() {
        this.menu = document.getElementById("menu") as HTMLDivElement
        this.menuItems = document.getElementById("menu-items") as HTMLDivElement
        this.menuButton = document.getElementById("menu-button") as HTMLDivElement

        document.addEventListener("mousemove", ({ pageX, pageY }) => {
            
            const { top, left } = this.menu.getBoundingClientRect()
            if(this.mousePress && pageX && pageY) {
                this.menu.style.top = `${top  + (pageY - this.prevY)}px`
                this.menu.style.left = `${left + (pageX - this.prevX)}px`
            }

            this.prevX = pageX
            this.prevY = pageY
        })

        document.addEventListener("mousedown", (e) => {
            if((e.target as HTMLDivElement).matches("#menu-button")) {
                this.menuButton.textContent = this.closed ? "-" : "+"
                this.menu.classList.toggle("menu-close")
                this.closed = !this.closed
            } else if((e.target as HTMLDivElement).closest("#menu-nav")) {
                this.mousePress = true
            } else if((e.target as HTMLDivElement).matches(".item") && e.target instanceof HTMLImageElement) {
                if(e.target === this.selectedItem) {
                    this.selectedItem?.classList.remove("item-selected")
                    this.selectedItem = undefined
                } else {
                    (e.target as HTMLImageElement).classList.add("item-selected")
                    this.selectedItem?.classList.remove("item-selected")
                    this.selectedItem = e.target
                }
            }
        })

        document.addEventListener("mouseup", () => {
            this.mousePress = false
        })

        IMAGES.forEach(
            ({ img, amount, columns, size, name }) => {

                const menu = document.createElement("canvas")
                menu.width = size;
                menu.height = size;
                const ctx =  menu.getContext("2d")!

                let imgRender = new Image()
                imgRender.src = img.src

                imgRender.onload = () => {


                    for (let i = 1; i <= amount; i++) {
                        const { x, y } = this.getFrameCoordinates(i, columns, size)


                        // Dibujar la porción recortada de la imagen en el canvas
                        ctx.drawImage(imgRender, x, y, size, size, 0, 0, size, size);

                        // Convertir el contenido del canvas a una URL de datos
                        var croppedImageUrl = menu.toDataURL('image/png');

                        // Asignar la URL de datos a la etiqueta <img> para mostrar la imagen recortada
                        var croppedImage = document.createElement("img");
                        croppedImage.src = croppedImageUrl;
                        croppedImage.draggable = false
                        croppedImage.classList.add("item")
                        croppedImage.dataset["index"] = i.toString()
                        croppedImage.dataset["name"] = name

                        ctx.clearRect(0, 0, size, size)

                        this.menuItems.appendChild(croppedImage)
                    }
                }
            }
        )
    }

    getFrameCoordinates(index: number, columns: number, size: number) {
        const x = ((index - 1) % columns) * size;
        const y = Math.floor((index - 1) / columns) * size;
        return { x, y };
    }

    public getSelectedItem() {
        return this.selectedItem
    }

    public getGameSelectedItem() {
        return this.gameItemSelected
    }

    public setGameSelectedItem(gameItemSelected: Item | null) {
        this.gameItemSelected = gameItemSelected
    }
}
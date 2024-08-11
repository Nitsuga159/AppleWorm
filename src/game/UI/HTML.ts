class HTML {
    public static COMPONENTS_PATH = "components"
    public static readonly PARENT_NODE_TAG = /<\s*(\w+)[^>]*>([\s\S]*)<\/\s*\1\s*>/
    private content: string | null = null
    private container: HTMLElement

    constructor({ container }: { container: HTMLElement }) {
        this.container = container
    }

    public getContent() {
        return this.content
    }

    public async injectHTML(name: string, props: { [key: string]: any } = {}) {
        await this.load(name)

        if(this.content) {
            this.container.innerHTML = Object.keys(props).reduce((content, key) => content.replace(new RegExp(`\\\$\{${key}\}`, "g"), props[key]), this.content)
        }

        return this
    }

    public getContainer() {
        return this.container
    }

    public removeHTML() {
        this.container.innerHTML = ""
    }

    private async load(name: string) {
        const data = await fetch(`${HTML.COMPONENTS_PATH}/${name}.html`)

        this.content = await data.text()

        return this
    }
}

export default new HTML({ container: document.getElementById("ui")! })
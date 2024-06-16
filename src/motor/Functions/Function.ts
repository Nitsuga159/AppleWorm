import Item from "../Items/Item";
import Loop from "../Loop";

export default abstract class Function {
    private enabled: boolean = true

    public isEnabled() {
        return this.enabled
    }

    public setIsEnabled(enabled: boolean) {
        this.enabled = enabled
    }

    public abstract applicate(ctx: Item, loop: Loop): void
}
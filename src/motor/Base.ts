export default class Base {
    private currentGroup: number = 0;

    public getNextGroup(): number {
        this.currentGroup++

        return 1 << this.currentGroup
    }
}
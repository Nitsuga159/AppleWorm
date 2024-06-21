import Canvas from "./Canvas";

type Listener<K extends keyof HTMLElementEventMap> = (ev: HTMLElementEventMap[K]) => any

export default class EventController {
    private static eventsController = new Map<keyof HTMLElementEventMap, Listener<keyof HTMLElementEventMap>[]>()

    public static addListener<K extends keyof HTMLElementEventMap>(event: K, listener: Listener<K>) {
        if (!this.eventsController.has(event)) {
            this.eventsController.set(event, []);
            Canvas.getCanvas().addEventListener(event, 
                (ev) => this.eventsController.get(event)?.forEach(l => l(ev as any))
            );
        }
        
        this.eventsController.get(event)?.push(listener as EventListener);
    }

    public static deleteListener<K extends keyof HTMLElementEventMap>(event: K, listener: Listener<K>) {
        const listeners = this.eventsController.get(event)
        if(listeners) {
            this.eventsController.set(event, listeners.filter(l  => l !== listener))
        }
    }
}

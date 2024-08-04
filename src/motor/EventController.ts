import Canvas from "./Canvas";

type Listener<K extends keyof HTMLElementEventMap> = (ev: HTMLElementEventMap[K]) => any

const normilizeCoors = (x: number, y: number) => {
    const canvas = Canvas.getCanvas()
    const realWidth = canvas.width; // 1300
    const realHeight = canvas.height; // 820

    // Tamaño visual del canvas (en pantalla)
    const visualWidth = canvas.clientWidth;
    const visualHeight = canvas.clientHeight;

    // Factores de escala
    const scaleX = realWidth / visualWidth;
    const scaleY = realHeight / visualHeight;

    return [(x - canvas.offsetLeft) * scaleX, (y - canvas.offsetTop) * scaleY]
}

export default class EventController {
    private static eventsController = new Map<keyof HTMLElementEventMap, Listener<keyof HTMLElementEventMap>[]>()

    public static addListener<K extends keyof HTMLElementEventMap>(event: K, listener: Listener<K>) {
        if (!this.eventsController.has(event)) {
            this.eventsController.set(event, []);
            Canvas.getCanvas().addEventListener(event,
                (ev: any) => {
                    if (typeof ev.clientX !== "undefined" && typeof ev.clientY !== "undefined") {
                        const [clientX, clientY] = normilizeCoors(ev.clientX, ev.clientY)

                        this.eventsController.get(event)?.forEach(l => {
                            l({ clientX, clientY } as any)
                        })
                    }
                });
        }

        this.eventsController.get(event)?.push(listener as EventListener);
    }

    public static deleteListener<K extends keyof HTMLElementEventMap>(event: K, listener: Listener<K>) {
        const listeners = this.eventsController.get(event)
        if (listeners) {
            this.eventsController.set(event, listeners.filter(l => l !== listener))
        }
    }
}

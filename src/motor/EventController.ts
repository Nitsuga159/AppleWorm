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

    // Obtener el rectángulo que define la posición y tamaño del canvas
    const rect = Canvas.getCanvas().getBoundingClientRect();

    // Determinar si el canvas está ajustado al ancho o al alto
    const isWidthAdjusted = visualWidth / visualHeight > realWidth / realHeight;

    const offsetX = x - rect.left;
    const offsetY = y - rect.top;

    // Ajuste según si el ancho o alto está ajustado
    const adjustedX = isWidthAdjusted
        ? (offsetX / visualWidth) * realWidth
        : (offsetX / visualWidth) * realWidth;
    const adjustedY = isWidthAdjusted
        ? (offsetY / visualHeight) * realHeight
        : (offsetY / visualHeight) * realHeight;

    return [adjustedX, adjustedY]
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

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { ViewportEvents } from "@/App/Applets/WorldMap/Renderer/Viewport/ViewportEvents";
import { EventEmitter } from "@/System/Event";
import { Inject, Service } from "@/System/Services";
import { Size } from "@/System/Types";

@Service()
export class Viewport extends EventEmitter<ViewportEvents>
{
    @Inject private readonly scissor: Scissor;

    private outputCanvas: HTMLCanvasElement;
    private outputContext: CanvasRenderingContext2D;
    private observer: ResizeObserver;
    private renderScale: number = 1.0;
    private viewportSize: Size = { width: 0, height: 0 };

    public attach(canvas: HTMLCanvasElement)
    {
        this.outputCanvas = canvas;
        this.outputContext = canvas.getContext('2d');

        this.observer = new ResizeObserver((entries) => this.onResize(entries[0]));
        this.observer.observe(canvas);
    }

    public detach()
    {
        this.observer.disconnect();
        this.observer = null;
    }

    public get size(): Size
    {
        return this.viewportSize;
    }

    public clear(): void
    {
        this.outputContext.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);
    }

    public compose(canvas?: CanvasImageSource): void
    {
        if (!canvas) {
            return;
        }

        this.outputContext.drawImage(canvas, 0, 0, this.outputCanvas.width, this.outputCanvas.height);
    }

    private onResize(entry: ResizeObserverEntry)
    {
        const width = entry.contentRect.width * this.renderScale;
        const height = entry.contentRect.height * this.renderScale;

        this.outputCanvas.width = width;
        this.outputCanvas.height = height;

        this.viewportSize = { width, height };
        this.scissor.resize(width, height);
        this.dispatch('resized', { width, height });
    }
}

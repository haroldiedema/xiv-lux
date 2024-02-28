/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { Drawing } from "@/App/Applets/WorldMap/Renderer/Viewport/Drawing";
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { Viewport } from "@/App/Applets/WorldMap/Renderer/Viewport/Viewport";
import { IconRepository } from "@/XIV/Texture/IconRepository";


export class Canvas extends Drawing
{
    public readonly canvas: OffscreenCanvas;
    public readonly context: OffscreenCanvasRenderingContext2D;

    public constructor(
        protected readonly camera: Camera,
        protected readonly scissor: Scissor,
        protected readonly icons: IconRepository,
        protected readonly viewport: Viewport,
    )
    {
        super();

        this.canvas = new OffscreenCanvas(2, 2);
        this.context = this.canvas.getContext('2d');

        viewport.on('resized', (e) =>
        {
            this.canvas.width = e.width;
            this.canvas.height = e.height;
        });
    }

    /**
     * Clears the canvas.
     */
    public clear(): void
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

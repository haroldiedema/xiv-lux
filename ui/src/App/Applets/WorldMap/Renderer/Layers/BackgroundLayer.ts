/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";

@Service({ tags: ['world-map.layer'] })
export class BackgroundLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private zoneId: number = null;
    private zoneImage: HTMLImageElement = null;

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = -Infinity;
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (this.zoneId !== this.mapContext.zone?.id) {
            this.zoneImage = null;
            this.loadZoneImage();
        }

        if (!this.zoneImage) {
            this.canvas.drawSquare(0, 0, 2048, { fill: '#e7dfb5' });

            return;
        }

        this.canvas.context.drawImage(
            this.zoneImage,
            this.scissor.x, this.scissor.y, this.scissor.width, this.scissor.height,
            0, 0, this.canvas.canvas.width, this.canvas.canvas.height
        );
    }

    private loadZoneImage(): void
    {
        if (!this.mapContext.zone) {
            return;
        }

        if (this.zoneId === this.mapContext.zone?.id) {
            return;
        }

        this.zoneId = this.mapContext.zone.id;
        const image = new Image();

        image.src = `${this.socket.httpAddress}/image/map/${this.mapContext.zone.id}.png`;
        image.onload = () => { this.zoneImage = image; };
    }
}

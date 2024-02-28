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
export class LocalPlayerLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private cameraAngle: number;

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = Infinity;
        this.socket.on('Camera', cam => this.cameraAngle = cam?.rotation ?? 0);
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.isCurrentZone || !this.player) {
            return;
        }

        this.canvas.drawIcon(60443, this.player.position, {
            size: 32,
            rotation: this.player.heading,
        });

        this.canvas.drawViewCone(this.player.position.x, this.player.position.y, this.cameraAngle, {
            width: Math.PI / 2,
            length: 64 / this.zoom,
            color: [99, 192, 255],
        });
    }
}

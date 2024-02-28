/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { WaymarkMarker } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class WaymarkLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private waymarks: WaymarkMarker[] = [];

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 65539;
        this.socket.subscribe('Waymarks', markers => this.waymarks = markers);
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.isCurrentZone) {
            return;
        }

        this.waymarks.forEach((marker) => this.drawMarker(marker));
    }

    private drawMarker(marker: WaymarkMarker): void
    {
        this.canvas.drawIcon(marker.iconId, marker.position, {
            size: 32,
            frustumCulled: true
        });
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { HousingMarker } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class HousingMarkerLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private housingMarkers: HousingMarker[] = [];

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 300;
        this.socket.on('HousingMarkers', markers => this.housingMarkers = markers);
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.zone) {
            return;
        }

        this.housingMarkers.forEach((marker) => this.drawMarker(marker));
    }

    private drawMarker(marker: HousingMarker): void
    {
        this.canvas.drawIcon(marker.iconId, marker.position, { frustumCulled: true });
    }
}

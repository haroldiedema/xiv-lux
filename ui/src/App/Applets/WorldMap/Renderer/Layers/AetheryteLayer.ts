/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Service } from "@/System/Services";
import { StaticMarker } from "@/XIV/Models";
import { StaticMarkerKind } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class AetheryteLayer extends AbstractLayer
{
    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 65534;
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.zone) {
            return;
        }

        this.mapContext.zone.staticMarkers
            .filter(marker => marker.kind === StaticMarkerKind.Aetheryte)
            .forEach((marker) => this.drawMarker(marker));
    }

    private drawMarker(marker: StaticMarker): void
    {
        this.addRaycasterCandidate(marker.hash, marker.position, { width: 32, height: 32 }, marker.metadata);

        this.canvas.drawIcon(marker.iconId, marker.position, { frustumCulled: true });
        this.canvas.drawText(marker.name, marker.position.x, marker.position.y - (12 / this.zoom), {
            color: this.isRaycasterHit(marker.hash) ? '#c0cfff' : '#fff',
            size: 12,
            outline: true
        });
    }
}

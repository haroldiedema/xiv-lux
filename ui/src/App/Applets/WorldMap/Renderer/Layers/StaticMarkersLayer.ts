/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { StaticMarker } from "@/XIV/Models";
import { QuestMarker, StaticMarkerKind } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class StaticMarkersLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private questMarkers: QuestMarker[] = [];

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 0;

        this.socket.on('QuestMarkers', markers => this.questMarkers = markers);
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.zone) {
            return;
        }

        this.mapContext.zone.staticMarkers.forEach((marker) => this.drawMarker(marker));
    }

    private drawMarker(marker: StaticMarker): void
    {
        if (marker.kind === StaticMarkerKind.MapLink && marker.iconId >= 63200 && marker.iconId <= 63899) {
            const image = this.getIcon(marker.iconId) as HTMLImageElement;
            if (!image) {
                return;
            }

            const width = (image.width / 1.2) * this.zoom;
            const height = (image.height / 1.2) * this.zoom;

            this.addRaycasterCandidate(marker.hash, marker.position, { width, height }, marker.metadata);

            const x = (marker.position.x - (image.width / 2)) + 85;
            const y = (marker.position.y - (image.height / 2)) + 86;

            const pos = this.canvas.translate(x, y, {});
            const hit = this.isRaycasterHit(marker.hash);

            this.canvas.context.globalAlpha = hit ? 1 : .5;
            this.canvas.context.drawImage(image, pos.x, pos.y, width, height);
            this.canvas.context.globalAlpha = 1;
            this.canvas.drawText(marker.name, marker.position.x, marker.position.y, { size: 16, color: '#fff', outline: true });

            const questLinks = this.questMarkers.filter(qm => qm.mapId === marker.metadata['targetMapId']);
            if (questLinks.length > 0) {
                this.canvas.drawText('Quests Available', marker.position.x, marker.position.y + 24, { size: 12, color: '#ffffc0', outline: true });
            }

            return;
        }

        if (marker.kind === StaticMarkerKind.Aetheryte || marker.kind === StaticMarkerKind.MapLink) {
            return;
        }

        if (marker.kind === StaticMarkerKind.Standard && marker.iconId === 0) {
            this.canvas.drawText(marker.name, marker.position.x, marker.position.y - (12 / this.zoom), {
                color: 'rgba(255, 255, 255, .5)',
                size: 24,
                shadow: true,
                autoScale: true,
                minScale: 20,
                maxScale: 32,
            });
            return;
        }

        const isEurekaCoffer = marker.metadata['isEurekaCoffer'] === 1;

        this.canvas.drawIcon(marker.iconId, marker.position, {
            frustumCulled: true,
            autoScale: true,
            minScale: 20,
            maxScale: 32,
            alpha: isEurekaCoffer ? .5 : 1,
        });

        if (marker.name) {
            this.canvas.drawText(marker.name, marker.position.x, marker.position.y - (12 / this.zoom), {
                size: 12, color: 'white', outline: true,
                minZoom: 2,
                frustumCulled: true,
            });
        }
    }
}

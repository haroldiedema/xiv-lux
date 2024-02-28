/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { QuestMarker, QuestMarkerKind } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class UnacceptedQuestsLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private questMarkers: QuestMarker[] = [];

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 200;
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

        this.questMarkers.forEach((marker) => this.drawMarker(marker));
    }

    private drawMarker(marker: QuestMarker): void
    {
        if (marker.mapId !== this.mapContext.zone.id) {
            return;
        }

        if (marker.kind === QuestMarkerKind.Accepted) {
            return; // TODO.
        }

        const hash = marker.questId.toString();
        const meta = { quest: marker.quest, iconId: marker.iconId };

        if (marker.kind === QuestMarkerKind.MapLink) {
            meta['targetMapId'] = marker.targetMapId;
        }

        this.addRaycasterCandidate(hash, marker.position, { width: 32, height: 32 }, meta);
        this.canvas.drawIcon(marker.iconId, marker.position, { frustumCulled: true });

        if (this.isRaycasterHit(hash)) {
            this.canvas.drawText(marker.quest.name, marker.position.x, marker.position.y - (14 / this.zoom), {
                color: '#ffc',
                size: 12,
                outline: true,
            });
        }
    }
}

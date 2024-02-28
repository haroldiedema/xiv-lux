/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { TextOptions } from "@/App/Applets/WorldMap/Renderer/Viewport/Drawing";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { StaticMarker, Vec2 } from "@/XIV/Models";
import { QuestMarker, QuestMarkerKind, StaticMarkerKind } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class MapLinkMarkersLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private questMarkers: QuestMarker[] = [];
    private textOptions: TextOptions = {
        font: 'sans-serif',
        size: 12,
        align: 'center',
        baseline: 'middle',
        color: '#9feef1',
        outline: true,
        shadow: false,
    };

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 400;
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
            return;
        }

        if (marker.kind !== StaticMarkerKind.MapLink) {
            return;
        }

        const questLinks = this.getQuestsInAdjecentMaps(marker);
        const textWidth = this.canvas.measureText(marker.name, this.textOptions).width;
        const paddingX = 16;
        const offsetX = (marker.position.x >= 1024 ? (-textWidth / 2) - paddingX : (textWidth / 2) + paddingX) / this.zoom;
        const textPos = marker.position.clone().add(new Vec2(offsetX, 0));

        this.addRaycasterCandidate(marker.hash, textPos, { width: textWidth + ((paddingX * 2) / this.zoom), height: 32 }, marker.metadata);
        const isHit = this.isRaycasterHit(marker.hash);

        if (marker.iconId > 0) {
            this.canvas.drawIcon(marker.iconId, marker.position, { frustumCulled: true });
        }

        this.canvas.drawText(marker.name, textPos.x, textPos.y, {
            ...this.textOptions,
            shadow: isHit,
            color: questLinks.length > 0 ? '#ffffaa' : this.textOptions.color,
        });

        if (isHit) {
            for (let i = 0; i < questLinks.length; i++) {
                this.canvas.drawText(questLinks[i].quest.name, textPos.x, textPos.y + (i + 1) * (14 / this.zoom), {
                    font: 'sans-serif',
                    size: 12,
                    align: marker.position.x >= 1024 ? 'right' : 'left',
                    baseline: 'middle',
                    color: '#ffffaa',
                    outline: true,
                });
            }
        }
    }

    private getQuestsInAdjecentMaps(marker: StaticMarker): QuestMarker[]
    {
        const adjecentZoneIds = marker.metadata['adjecentZones'] as number[] ?? [];
        return this.questMarkers.filter(quest =>
            quest.kind === QuestMarkerKind.Accepted &&
            quest.mapId !== this.mapContext.zone.id &&
            adjecentZoneIds.includes(quest.mapId)
        );
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Vec2 } from "@/XIV/Models";
import { QuestMarkerKind, StaticMarkerKind } from "@/XIV/Models/Generated";
let MapLinkMarkersLayer = class MapLinkMarkersLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.questMarkers = [];
        this.textOptions = {
            font: 'sans-serif',
            size: 12,
            align: 'center',
            baseline: 'middle',
            color: '#9feef1',
            outline: true,
            shadow: false,
        };
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 400;
        this.socket.on('QuestMarkers', markers => this.questMarkers = markers);
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.zone) {
            return;
        }
        this.mapContext.zone.staticMarkers.forEach((marker) => this.drawMarker(marker));
    }
    drawMarker(marker) {
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
    getQuestsInAdjecentMaps(marker) {
        const adjecentZoneIds = marker.metadata['adjecentZones'] ?? [];
        return this.questMarkers.filter(quest => quest.kind === QuestMarkerKind.Accepted &&
            quest.mapId !== this.mapContext.zone.id &&
            adjecentZoneIds.includes(quest.mapId));
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], MapLinkMarkersLayer.prototype, "socket", void 0);
MapLinkMarkersLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], MapLinkMarkersLayer);
export { MapLinkMarkersLayer };
//# sourceMappingURL=MapLinkMarkerLayer.js.map
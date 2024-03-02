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
import { StaticMarkerKind } from "@/XIV/Models/Generated";
let StaticMarkersLayer = class StaticMarkersLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.questMarkers = [];
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 0;
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
            const image = this.getIcon(marker.iconId);
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
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], StaticMarkersLayer.prototype, "socket", void 0);
StaticMarkersLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], StaticMarkersLayer);
export { StaticMarkersLayer };
//# sourceMappingURL=StaticMarkersLayer.js.map
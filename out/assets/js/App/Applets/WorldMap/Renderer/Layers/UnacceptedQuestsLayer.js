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
import { QuestMarkerKind } from "@/XIV/Models/Generated";
let UnacceptedQuestsLayer = class UnacceptedQuestsLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.questMarkers = [];
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 200;
        this.socket.on('QuestMarkers', markers => this.questMarkers = markers);
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.zone) {
            return;
        }
        this.questMarkers.forEach((marker) => this.drawMarker(marker));
    }
    drawMarker(marker) {
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
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], UnacceptedQuestsLayer.prototype, "socket", void 0);
UnacceptedQuestsLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], UnacceptedQuestsLayer);
export { UnacceptedQuestsLayer };
//# sourceMappingURL=UnacceptedQuestsLayer.js.map
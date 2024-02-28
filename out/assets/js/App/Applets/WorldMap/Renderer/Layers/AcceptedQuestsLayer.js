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
let AcceptedQuestsLayer = class AcceptedQuestsLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.questMarkers = [];
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 300;
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
        if (marker.kind !== QuestMarkerKind.Accepted) {
            return;
        }
        if (this.mapContext.isCurrentZone) {
            const i = this.canvas.findIntersection(this.player.position, marker.position, true);
            if (i) {
                const p1 = this.canvas.translate(this.player.position).mut();
                const p2 = this.canvas.translate(marker.position).mut();
                // Direction vectors.
                const markerToPlayer = p1.mut().subtract(p2).normalize();
                const playerToMarker = p2.mut().subtract(p1).normalize();
                if (marker.radius > 0) {
                    p2.add(markerToPlayer.multiplyScalar(marker.radius * this.zoom));
                }
                this.canvas.drawLine(p1.x, p1.y, p2.x, p2.y, {
                    noTranslate: true,
                    stroke: 'rgba(255, 134, 0, 0.5)',
                    strokeWidth: 3,
                    strokeDash: [10, 5],
                    dashOffset: -this.elapsedTime / 50
                });
            }
        }
        if (marker.iconId > 0) {
            const hash = marker.questId.toString();
            this.addRaycasterCandidate(hash, marker.position, { width: 32, height: 32 }, { quest: marker.quest, iconId: marker.iconId });
            this.canvas.drawIcon(marker.iconId, marker.position, { frustumCulled: true });
            return;
        }
        const pos = this.canvas.translate(marker.position);
        const gradient = this.canvas.context.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, marker.radius * this.zoom);
        gradient.addColorStop(0.33, 'rgba(255, 134, 0, 0)');
        gradient.addColorStop(1, 'rgba(255, 134, 0, 0.5)');
        this.canvas.drawArc(marker.position.x, marker.position.y, {
            radius: marker.radius * this.zoom,
            fill: gradient,
            stroke: 'rgba(255, 134, 0, 0.9)',
            strokeWidth: 3,
            strokeDash: [10, 5],
            dashOffset: -this.elapsedTime / 50,
        });
        this.canvas.drawIcon(60439, marker.position, { frustumCulled: true, size: (marker.radius - 4) * this.zoom });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], AcceptedQuestsLayer.prototype, "socket", void 0);
AcceptedQuestsLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], AcceptedQuestsLayer);
export { AcceptedQuestsLayer };
//# sourceMappingURL=AcceptedQuestsLayer.js.map
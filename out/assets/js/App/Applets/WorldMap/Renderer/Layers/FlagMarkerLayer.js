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
let FlagMarkerLayer = class FlagMarkerLayer extends AbstractLayer {
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 65536;
        this.socket.subscribe('FlagMarker', marker => this.flagMarker = marker);
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.zone || this.mapContext.zone.id !== this.flagMarker?.mapId || this.mapContext.zone.territoryId !== this.flagMarker?.territoryId) {
            return;
        }
        this.canvas.drawIcon(this.flagMarker.iconId, this.flagMarker.position, {
            size: 32,
            frustumCulled: true
        });
        if (!this.mapContext.isCurrentZone) {
            return;
        }
        const intersection = this.canvas.findIntersection(this.player.position, this.flagMarker.position, true);
        if (!intersection) {
            return;
        }
        // Draw a line from the flag to the player.
        this.canvas.drawLine(this.flagMarker.position.x, this.flagMarker.position.y, this.player.position.x, this.player.position.y, {
            stroke: 'rgba(200, 77, 77, 0.66)',
            strokeWidth: 3,
            strokeDash: [6, 9],
            dashOffset: this.elapsedTime * 0.05,
        });
        const playerPos = this.canvas.translate(this.player.position);
        const direction = intersection.subtract(playerPos).normalize().multiplyScalar(32);
        const textPos = intersection.subtract(direction);
        const distance = this.player.position.toWorldCoordinates(this.mapContext.zone).distanceTo(this.flagMarker.position.toWorldCoordinates(this.mapContext.zone));
        const textOpts = {
            font: 'monospace',
            size: 13,
            color: '#ffb0a0',
            shadow: true,
            outline: true,
            noTranslate: true,
            align: 'center',
        };
        this.canvas.drawText(`Flag`, textPos.x, textPos.y, { ...textOpts, size: 12 });
        this.canvas.drawText(`${Math.round(distance)}y`, textPos.x, textPos.y + 13, textOpts);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], FlagMarkerLayer.prototype, "socket", void 0);
FlagMarkerLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], FlagMarkerLayer);
export { FlagMarkerLayer };
//# sourceMappingURL=FlagMarkerLayer.js.map
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
import { GameState } from "@/XIV/GameState";
import { NpcActor } from "@/XIV/Models";
let CombatCardinalsLayer = class CombatCardinalsLayer extends AbstractLayer {
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 65535;
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.isCurrentZone || !this.gameState.isInCombat || !this.player.target || this.hasCustomCameraOffset) {
            return;
        }
        const target = this.player.target;
        if (!(target instanceof NpcActor) || !target.isInCombat) {
            return;
        }
        const x = this.player.target.position.x;
        const y = this.player.target.position.y;
        const w = (this.viewportSize.width / 2) / this.zoom;
        const h = (this.viewportSize.height / 2) / this.zoom;
        this.canvas.drawLine(x - w, y, x + w, y, { stroke: 'rgba(255, 0, 0, .15)', strokeWidth: 1 });
        this.canvas.drawLine(x, y - h, x, y + h, { stroke: 'rgba(255, 0, 0, .15)', strokeWidth: 1 });
        this.canvas.drawText('NW', x - (w / 2), y - (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
        this.canvas.drawText('NE', x + (w / 2), y - (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
        this.canvas.drawText('SW', x - (w / 2), y + (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
        this.canvas.drawText('SE', x + (w / 2), y + (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
    }
};
__decorate([
    Inject,
    __metadata("design:type", GameState)
], CombatCardinalsLayer.prototype, "gameState", void 0);
CombatCardinalsLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], CombatCardinalsLayer);
export { CombatCardinalsLayer };
//# sourceMappingURL=CombatCardinalsLayer.js.map
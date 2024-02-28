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
import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Service } from "@/System/Services";
let EnemyNpcLayer = class EnemyNpcLayer extends AbstractLayer {
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 1;
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.isCurrentZone) {
            return;
        }
        this.npcs.forEach(npc => {
            if (npc.kind !== 0 || !npc.isTargetable || (!npc.isHostile && (this.player.isGatherer || this.player.isCrafter))) {
                return;
            }
            if (!npc.isDead && !this.player.isCrafter && !this.player.isGatherer) {
                this.canvas.drawViewCone(npc.position.x, npc.position.y, npc.heading, {
                    width: Math.PI / 2,
                    length: 16,
                    color: npc.isHostile ? [255, 100, 90] : [200, 190, 33],
                    opacity: 0.33,
                    frustumCulled: true,
                });
            }
            if (npc.rank > 0) {
                this.canvas.drawIcon(61710, npc.position, {
                    frustumCulled: true,
                });
            }
            else {
                const color = npc.isDead ? '#c0c0c0' : (npc.isHostile ? '#ff645a' : '#c8be21');
                this.canvas.drawArc(npc.position.x, npc.position.y, {
                    radius: 3,
                    fill: color,
                    autoScale: true,
                    minScale: 1,
                    maxScale: 3,
                });
            }
            if (!this.player.isCrafter && !this.player.isGatherer) {
                this.canvas.drawText(npc.name + (npc.rank > 0 ? ` <${npc.rankName}>` : ''), npc.position.x, npc.position.y - (14 / this.zoom), {
                    color: npc.isDead ? 'rgba(255, 255, 255, .66)' : '#fff',
                    size: npc.rank > 0 ? 12 : 10,
                    outline: true,
                    minZoom: npc.rank > 0 ? 0 : 2,
                    maxZoom: 3.9,
                    frustumCulled: true,
                });
            }
        });
    }
};
EnemyNpcLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], EnemyNpcLayer);
export { EnemyNpcLayer };
//# sourceMappingURL=EnemyNpcLayer.js.map
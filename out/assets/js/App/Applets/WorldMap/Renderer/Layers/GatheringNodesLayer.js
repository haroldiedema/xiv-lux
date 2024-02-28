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
let GatheringNodesLayer = class GatheringNodesLayer extends AbstractLayer {
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 100;
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.zone || !this.mapContext.isCurrentZone) {
            return;
        }
        this.gatheringNodes.forEach(node => this.drawNode(node));
    }
    drawNode(node) {
        if (!node.isTargetable) {
            return;
        }
        const p1 = this.canvas.translate(this.player.position);
        const p2 = this.canvas.translate(node.position);
        const is = this.canvas.findIntersection(p1, p2);
        if (is) {
            this.canvas.drawLine(p1.x, p1.y, is.x, is.y, {
                noTranslate: true,
                stroke: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 3,
                strokeDash: [5, 5],
                dashOffset: this.elapsedTime / 50,
            });
            this.canvas.drawLine(p1.x, p1.y, is.x, is.y, {
                noTranslate: true,
                stroke: 'rgba(255, 255, 196, 0.5)',
                strokeWidth: 2,
                strokeDash: [5, 5],
                dashOffset: this.elapsedTime / 50,
            });
        }
        this.canvas.drawIcon(node.iconId, node.position, {
            size: 32,
        });
    }
};
GatheringNodesLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], GatheringNodesLayer);
export { GatheringNodesLayer };
//# sourceMappingURL=GatheringNodesLayer.js.map
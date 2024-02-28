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
let WaymarkLayer = class WaymarkLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.waymarks = [];
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 65539;
        this.socket.subscribe('Waymarks', markers => this.waymarks = markers);
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.isCurrentZone) {
            return;
        }
        this.waymarks.forEach((marker) => this.drawMarker(marker));
    }
    drawMarker(marker) {
        this.canvas.drawIcon(marker.iconId, marker.position, {
            size: 32,
            frustumCulled: true
        });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], WaymarkLayer.prototype, "socket", void 0);
WaymarkLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], WaymarkLayer);
export { WaymarkLayer };
//# sourceMappingURL=WaymarkLayer.js.map
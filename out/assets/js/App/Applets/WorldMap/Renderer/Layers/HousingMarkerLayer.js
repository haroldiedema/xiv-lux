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
let HousingMarkerLayer = class HousingMarkerLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.housingMarkers = [];
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 300;
        this.socket.on('HousingMarkers', markers => this.housingMarkers = markers);
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.zone) {
            return;
        }
        this.housingMarkers.forEach((marker) => this.drawMarker(marker));
    }
    drawMarker(marker) {
        this.canvas.drawIcon(marker.iconId, marker.position, { frustumCulled: true });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], HousingMarkerLayer.prototype, "socket", void 0);
HousingMarkerLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], HousingMarkerLayer);
export { HousingMarkerLayer };
//# sourceMappingURL=HousingMarkerLayer.js.map
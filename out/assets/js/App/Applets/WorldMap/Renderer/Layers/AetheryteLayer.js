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
import { StaticMarkerKind } from "@/XIV/Models/Generated";
let AetheryteLayer = class AetheryteLayer extends AbstractLayer {
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 65534;
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.zone) {
            return;
        }
        this.mapContext.zone.staticMarkers
            .filter(marker => marker.kind === StaticMarkerKind.Aetheryte)
            .forEach((marker) => this.drawMarker(marker));
    }
    drawMarker(marker) {
        this.addRaycasterCandidate(marker.hash, marker.position, { width: 32, height: 32 }, marker.metadata);
        this.canvas.drawIcon(marker.iconId, marker.position, { frustumCulled: true });
        this.canvas.drawText(marker.name, marker.position.x, marker.position.y - (12 / this.zoom), {
            color: this.isRaycasterHit(marker.hash) ? '#c0cfff' : '#fff',
            size: 12,
            outline: true
        });
    }
};
AetheryteLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], AetheryteLayer);
export { AetheryteLayer };
//# sourceMappingURL=AetheryteLayer.js.map
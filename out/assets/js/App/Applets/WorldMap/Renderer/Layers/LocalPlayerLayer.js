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
let LocalPlayerLayer = class LocalPlayerLayer extends AbstractLayer {
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = Infinity;
        this.socket.on('Camera', cam => this.cameraAngle = cam?.rotation ?? 0);
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.isCurrentZone || !this.player) {
            return;
        }
        this.canvas.drawIcon(60443, this.player.position, {
            size: 32,
            rotation: this.player.heading,
        });
        this.canvas.drawViewCone(this.player.position.x, this.player.position.y, this.cameraAngle, {
            width: Math.PI / 2,
            length: 64 / this.zoom,
            color: [99, 192, 255],
        });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], LocalPlayerLayer.prototype, "socket", void 0);
LocalPlayerLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], LocalPlayerLayer);
export { LocalPlayerLayer };
//# sourceMappingURL=LocalPlayerLayer.js.map
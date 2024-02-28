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
let BackgroundLayer = class BackgroundLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.zoneId = null;
        this.zoneImage = null;
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = -Infinity;
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (this.zoneId !== this.mapContext.zone?.id) {
            this.zoneImage = null;
            this.loadZoneImage();
        }
        if (!this.zoneImage) {
            this.canvas.drawSquare(0, 0, 2048, { fill: '#e7dfb5' });
            return;
        }
        this.canvas.context.drawImage(this.zoneImage, this.scissor.x, this.scissor.y, this.scissor.width, this.scissor.height, 0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    }
    loadZoneImage() {
        if (!this.mapContext.zone) {
            return;
        }
        if (this.zoneId === this.mapContext.zone?.id) {
            return;
        }
        this.zoneId = this.mapContext.zone.id;
        const image = new Image();
        image.src = `${this.socket.httpAddress}/image/map/${this.mapContext.zone.id}.png`;
        image.onload = () => { this.zoneImage = image; };
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], BackgroundLayer.prototype, "socket", void 0);
BackgroundLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], BackgroundLayer);
export { BackgroundLayer };
//# sourceMappingURL=BackgroundLayer.js.map
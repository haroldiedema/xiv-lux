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
import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { Inject, Service } from "@/System/Services";
import { Vec2 } from "@/XIV/Models/Vec2";
let Scissor = class Scissor {
    constructor() {
        this.viewport = { x: 0, y: 0, width: 0, height: 0 };
        this.scissor = { x: 0, y: 0, width: 0, height: 0 };
    }
    resize(width, height) {
        this.viewport.width = width;
        this.viewport.height = height;
    }
    update() {
        const camera = this.camera.position;
        const zoom = this.camera.zoom;
        this.scissor.x = camera.x - this.viewport.width / zoom / 2;
        this.scissor.y = camera.y - this.viewport.height / zoom / 2;
        this.scissor.width = this.viewport.width / zoom;
        this.scissor.height = this.viewport.height / zoom;
    }
    get rect() {
        return this.scissor;
    }
    /**
     * Returns the screen position of the given map texture position.
     */
    getScreenPosition(v) {
        return new Vec2((v.x - this.scissor.x) * this.camera.zoom, (v.y - this.scissor.y) * this.camera.zoom);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Camera)
], Scissor.prototype, "camera", void 0);
Scissor = __decorate([
    Service()
], Scissor);
export { Scissor };
//# sourceMappingURL=Scissor.js.map
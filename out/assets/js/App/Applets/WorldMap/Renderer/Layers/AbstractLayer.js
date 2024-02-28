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
import { Canvas } from "@/App/Applets/WorldMap/Renderer/Viewport/Canvas";
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { Viewport } from "@/App/Applets/WorldMap/Renderer/Viewport/Viewport";
import { Inject } from "@/System/Services";
import { ActorManager } from "@/XIV/ActorManager";
import { IconRepository } from "@/XIV/Texture/IconRepository";
export class AbstractLayer {
    constructor() {
        this.renderOrder = 0;
        this.autoClear = true;
        this.deltaTime = 0;
        this.elapsedTime = 0;
        this.mapContext = null;
        this.canvas = new Canvas(this._camera, this._scissor, this._icons, this._viewport);
        this.init();
    }
    render(context, deltaTime, elapsedTime) {
        if (!this._actors.player) {
            return;
        }
        if (this.autoClear) {
            this.canvas.clear();
        }
        this.mapContext = context;
        this.deltaTime = deltaTime;
        this.elapsedTime = elapsedTime;
        this.draw();
        return this.canvas.canvas;
    }
    get player() {
        return this._actors.player;
    }
    get players() {
        return this._actors.players;
    }
    get npcs() {
        return this._actors.npcs;
    }
    get gatheringNodes() {
        return this._actors.gatheringNodes;
    }
    get camera() {
        return this._camera.position;
    }
    get zoom() {
        return this._camera.zoom;
    }
    get scissor() {
        return this._scissor.rect;
    }
    get viewportSize() {
        return this._viewport.size;
    }
    get hasCustomCameraOffset() {
        return this._camera.offset.length() > 0;
    }
    getIcon(iconId) {
        return this._icons.getCached(iconId);
    }
    addRaycasterCandidate(id, position, size, metadata = {}) {
        this._raycaster.addCandidate({ id, position, size, metadata });
    }
    isRaycasterHit(id) {
        return this._raycaster.isHit(id);
    }
}
__decorate([
    Inject,
    __metadata("design:type", Camera)
], AbstractLayer.prototype, "_camera", void 0);
__decorate([
    Inject,
    __metadata("design:type", Scissor)
], AbstractLayer.prototype, "_scissor", void 0);
__decorate([
    Inject,
    __metadata("design:type", Viewport)
], AbstractLayer.prototype, "_viewport", void 0);
__decorate([
    Inject,
    __metadata("design:type", IconRepository)
], AbstractLayer.prototype, "_icons", void 0);
__decorate([
    Inject,
    __metadata("design:type", ActorManager)
], AbstractLayer.prototype, "_actors", void 0);
__decorate([
    Inject,
    __metadata("design:type", Raycaster)
], AbstractLayer.prototype, "_raycaster", void 0);
//# sourceMappingURL=AbstractLayer.js.map
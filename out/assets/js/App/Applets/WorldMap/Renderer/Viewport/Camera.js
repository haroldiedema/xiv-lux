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
var Camera_1;
import { MathUtils } from "@/System/Math/MathUtils";
import { Service } from "@/System/Services";
import { Vec2 } from "@/XIV/Models/Vec2";
let Camera = class Camera {
    constructor() {
        this.sourcePosition = new Vec2(1024, 1024).mut();
        this.targetPosition = new Vec2(1024, 1024).mut();
        this.offsetPosition = new Vec2(0, 0).mut();
        this.sourceZoomFactor = 1.0;
        this.targetZoomFactor = 1.0;
        this.tempZoomFactor = 0;
    }
    static { Camera_1 = this; }
    static { this.ZOOM_MIN = 0.25; }
    static { this.ZOOM_MAX = 6.0; }
    static { this.MAP_SIZE = 2048; }
    update(viewportSize, deltaTime) {
        let zoomFactor = this.tempZoomFactor || this.sourceZoomFactor;
        zoomFactor = MathUtils.clamp(zoomFactor, Math.max(viewportSize.width, viewportSize.height) / Camera_1.MAP_SIZE, Camera_1.ZOOM_MAX);
        this.targetZoomFactor = MathUtils.interpolate(this.targetZoomFactor, zoomFactor, deltaTime * (this.tempZoomFactor ? 0.0005 : 0.0075));
        const minX = viewportSize.width / 2 / this.targetZoomFactor;
        const minY = viewportSize.height / 2 / this.targetZoomFactor;
        const maxX = Camera_1.MAP_SIZE - minX;
        const maxY = Camera_1.MAP_SIZE - minY;
        this.sourcePosition.clamp(minX, minY, maxX, maxY);
        this.offsetPosition.clamp(minX - this.sourcePosition.x, minY - this.sourcePosition.y, maxX - this.sourcePosition.x, maxY - this.sourcePosition.y);
        const pos = this.sourcePosition.clone().add(this.offsetPosition).clamp(minX, minY, maxX, maxY);
        this.targetPosition.lerp(pos, deltaTime * 0.0075);
        this.targetPosition.clamp(minX, minY, maxX, maxY);
    }
    set position(v) {
        this.sourcePosition.copyFrom(v);
    }
    get position() {
        return this.targetPosition;
    }
    get offset() {
        return this.offsetPosition;
    }
    get zoom() {
        return this.targetZoomFactor;
    }
    zoomIn() {
        this.sourceZoomFactor = MathUtils.clamp(this.sourceZoomFactor * 1.1, Camera_1.ZOOM_MIN, Camera_1.ZOOM_MAX);
    }
    zoomOut() {
        this.sourceZoomFactor = MathUtils.clamp(this.sourceZoomFactor * 0.9, Camera_1.ZOOM_MIN, Camera_1.ZOOM_MAX);
    }
    setTempZoom(factor) {
        this.tempZoomFactor = MathUtils.clamp(factor, Camera_1.ZOOM_MIN, Camera_1.ZOOM_MAX);
    }
    clearTempZoom() {
        this.tempZoomFactor = null;
    }
    resetZoom() {
        this.sourceZoomFactor = .5;
    }
};
Camera = Camera_1 = __decorate([
    Service()
], Camera);
export { Camera };
//# sourceMappingURL=Camera.js.map
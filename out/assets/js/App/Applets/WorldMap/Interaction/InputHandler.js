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
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Inject, Service } from "@/System/Services";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
let InputHandler = class InputHandler {
    constructor() {
        this._isPanning = false;
        this._currentZone = null;
        this._zone = null;
        this.socket.on('CurrentZone', zone => this._currentZone = zone);
        this.socket.on('SelectedZone', zone => this._zone = zone);
    }
    attach(canvas) {
        this._canvas = canvas;
        this.raycaster.attach(canvas);
        canvas.addEventListener('wheel', this.onMouseWheel);
        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('dblclick', this.onDoubleClick);
    }
    detach() {
        this.raycaster.detach();
        this._canvas.removeEventListener('wheel', this.onMouseWheel);
        this._canvas.removeEventListener('mousedown', this.onMouseDown);
        this._canvas.removeEventListener('dblclick', this.onDoubleClick);
    }
    onMouseWheel(e) {
        e.deltaY > 0 ? this.camera.zoomOut() : this.camera.zoomIn();
    }
    onMouseDown(e) {
        if (e.button === 0) {
            this._isPanning = true;
            window.addEventListener('mousemove', this.onWindowMouseMove);
            window.addEventListener('mouseup', this.onWindowMouseUp);
            document.body.addEventListener('mouseleave', this.onWindowMouseLeave);
            return;
        }
        // Add/remove flag marker.
        if (e.button === 1) {
            if (e.shiftKey) {
                this.invoker.zone.removeFlagMarker();
                return;
            }
            this.invoker.zone.setFlagMarker(this._zone.id, this._zone.territoryId, this.raycaster.cursor.x, this.raycaster.cursor.y);
            if (this._currentZone?.id !== this._zone.id) {
                this.camera.offset.set(0, 0);
            }
        }
    }
    onWindowMouseMove(e) {
        if (!this._isPanning) {
            return;
        }
        this.camera.offset.x -= e.movementX / this.camera.zoom;
        this.camera.offset.y -= e.movementY / this.camera.zoom;
    }
    onWindowMouseUp(e) {
        if (e.button === 0) {
            this._isPanning = false;
            this.onWindowMouseMove(e);
        }
    }
    onWindowMouseLeave(e) {
        this._isPanning = false;
        window.removeEventListener('mousemove', this.onWindowMouseMove);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
        document.body.removeEventListener('mouseleave', this.onWindowMouseLeave);
    }
    onDoubleClick(e) {
        this.camera.offset.set(0, 0);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Camera)
], InputHandler.prototype, "camera", void 0);
__decorate([
    Inject,
    __metadata("design:type", Raycaster)
], InputHandler.prototype, "raycaster", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], InputHandler.prototype, "invoker", void 0);
__decorate([
    Inject,
    __metadata("design:type", Socket)
], InputHandler.prototype, "socket", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WheelEvent]),
    __metadata("design:returntype", void 0)
], InputHandler.prototype, "onMouseWheel", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], InputHandler.prototype, "onMouseDown", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], InputHandler.prototype, "onWindowMouseMove", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], InputHandler.prototype, "onWindowMouseUp", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], InputHandler.prototype, "onWindowMouseLeave", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], InputHandler.prototype, "onDoubleClick", null);
InputHandler = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], InputHandler);
export { InputHandler };
//# sourceMappingURL=InputHandler.js.map
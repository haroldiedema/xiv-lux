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
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { Inject, InjectTagged, Service } from "@/System/Services";
import { Bound } from "@/System/Types";
import { Vec2 } from "@/XIV/Models";
let Raycaster = class Raycaster {
    constructor() {
        this.cursor = new Vec2().mut();
        this.candidates = [];
        this.hit = null;
        this.downPos = new Vec2().mut();
        this.downTime = 0;
    }
    attach(canvas) {
        this.canvas = canvas;
        canvas.addEventListener('mousemove', this.onMouseMove);
        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('mouseup', this.onMouseUp);
    }
    detach() {
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
    }
    reset() {
        this.candidates = [];
    }
    addCandidate(candidate) {
        this.candidates.push(candidate);
    }
    isHit(id) {
        return this.hit?.id === id;
    }
    get hitCandidate() {
        return this.hit;
    }
    onMouseMove(e) {
        this.cursor.set((e.offsetX / this.camera.zoom) + this.scissor.rect.x, (e.offsetY / this.camera.zoom) + this.scissor.rect.y);
        this.hit = null;
        let hits = [];
        this.candidates.forEach(candidate => {
            const w = candidate.size.width / 2;
            const h = candidate.size.height / 2;
            if (this.cursor.x >= candidate.position.x - w &&
                this.cursor.x <= candidate.position.x + w &&
                this.cursor.y >= candidate.position.y - h &&
                this.cursor.y <= candidate.position.y + h) {
                hits.unshift(candidate);
            }
        });
        // Sort by distance.
        hits = hits.sort((a, b) => a.position.distanceTo(this.cursor) - b.position.distanceTo(this.cursor));
        this.hit = hits[0] ?? null;
    }
    onMouseDown(e) {
        if (!this.hit) {
            return;
        }
        this.downPos.copyFrom(this.cursor);
        this.downTime = Date.now();
    }
    onMouseUp(e) {
        if (!this.hit) {
            return;
        }
        if (this.downPos.distanceTo(this.cursor) > 10 || Date.now() - this.downTime > 200) {
            return;
        }
        this.handlers.forEach((handler) => {
            if (handler.supports(this.hit)) {
                handler.handle(this.hit);
            }
        });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Camera)
], Raycaster.prototype, "camera", void 0);
__decorate([
    Inject,
    __metadata("design:type", Scissor)
], Raycaster.prototype, "scissor", void 0);
__decorate([
    InjectTagged('world-map.raycaster.handler'),
    __metadata("design:type", Array)
], Raycaster.prototype, "handlers", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], Raycaster.prototype, "onMouseMove", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], Raycaster.prototype, "onMouseDown", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], Raycaster.prototype, "onMouseUp", null);
Raycaster = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], Raycaster);
export { Raycaster };
//# sourceMappingURL=Raycaster.js.map
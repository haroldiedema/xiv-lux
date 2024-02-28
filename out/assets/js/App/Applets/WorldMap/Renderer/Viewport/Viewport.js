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
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { EventEmitter } from "@/System/Event";
import { Inject, Service } from "@/System/Services";
let Viewport = class Viewport extends EventEmitter {
    constructor() {
        super(...arguments);
        this.renderScale = 1.0;
        this.viewportSize = { width: 0, height: 0 };
    }
    attach(canvas) {
        this.outputCanvas = canvas;
        this.outputContext = canvas.getContext('2d');
        this.observer = new ResizeObserver((entries) => this.onResize(entries[0]));
        this.observer.observe(canvas);
    }
    detach() {
        this.observer.disconnect();
        this.observer = null;
    }
    get size() {
        return this.viewportSize;
    }
    clear() {
        this.outputContext.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);
    }
    compose(canvas) {
        if (!canvas) {
            return;
        }
        this.outputContext.drawImage(canvas, 0, 0, this.outputCanvas.width, this.outputCanvas.height);
    }
    onResize(entry) {
        const width = entry.contentRect.width * this.renderScale;
        const height = entry.contentRect.height * this.renderScale;
        this.outputCanvas.width = width;
        this.outputCanvas.height = height;
        this.viewportSize = { width, height };
        this.scissor.resize(width, height);
        this.dispatch('resized', { width, height });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Scissor)
], Viewport.prototype, "scissor", void 0);
Viewport = __decorate([
    Service()
], Viewport);
export { Viewport };
//# sourceMappingURL=Viewport.js.map
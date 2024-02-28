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
import { Inject, Service } from "@/System/Services";
import { Invoker } from "@/System/Socket";
let AetheryteHandler = class AetheryteHandler {
    /**
     * @inheritdoc
     */
    supports(candidate) {
        return typeof candidate.metadata?.aetheryteId === 'number';
    }
    /**
     * @inheritdoc
     */
    handle(candidate) {
        this.invoker.aetheryte.teleport(candidate.metadata.aetheryteId);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], AetheryteHandler.prototype, "invoker", void 0);
AetheryteHandler = __decorate([
    Service({ tags: ['world-map.raycaster.handler'] })
], AetheryteHandler);
export { AetheryteHandler };
//# sourceMappingURL=AetheryteHandler.js.map
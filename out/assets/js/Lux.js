var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { Container, Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Invoker } from "@/System/Socket/Invoker";
let Lux = class Lux {
    constructor() {
        document.body.appendChild(document.createElement('lux-app'));
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], Lux.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], Lux.prototype, "invoker", void 0);
Lux = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], Lux);
// Bootstrap.
window.addEventListener('load', async () => Container.compile().then(() => Container.get(Lux)));
//# sourceMappingURL=Lux.js.map
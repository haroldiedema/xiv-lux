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
import { ModelExtension } from "@/System/Serializer";
import { StaticMarker as GeneratedStaticMarker } from "@/XIV/Models/Generated/StaticMarker";
let StaticMarker = class StaticMarker extends GeneratedStaticMarker {
    constructor() {
        super(...arguments);
        this.hash = null;
    }
    __init__() {
        this.hash = `${this.kind}-${this.iconId}-${this.position.x}-${this.position.y}`;
    }
};
StaticMarker = __decorate([
    ModelExtension('StaticMarker')
], StaticMarker);
export { StaticMarker };
//# sourceMappingURL=StaticMarker.js.map
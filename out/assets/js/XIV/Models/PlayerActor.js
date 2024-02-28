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
import { PlayerActor as GeneratedPlayerActor } from "@/XIV/Models/Generated/PlayerActor";
let PlayerActor = class PlayerActor extends GeneratedPlayerActor {
    constructor() {
        super(...arguments);
        this.target = null;
        this.isGatherer = false;
        this.isCrafter = false;
    }
    __init__() {
        this.isCrafter = this.jobId >= 8 && this.jobId <= 15;
        this.isGatherer = this.jobId >= 16 && this.jobId <= 18;
    }
};
PlayerActor = __decorate([
    ModelExtension('PlayerActor')
], PlayerActor);
export { PlayerActor };
//# sourceMappingURL=PlayerActor.js.map
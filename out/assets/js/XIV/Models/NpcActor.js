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
import { NpcActor as GeneratedNpcActor } from "@/XIV/Models/Generated/NpcActor";
let NpcActor = class NpcActor extends GeneratedNpcActor {
    constructor() {
        super(...arguments);
        this.target = null;
        this.rankName = '';
    }
    __init__() {
        switch (this.rank) {
            case 1:
                this.rankName = 'B';
                break;
            case 2:
                this.rankName = 'A';
                break;
            case 3:
                this.rankName = 'S';
                break;
            case 4:
                this.rankName = 'SS';
                break;
        }
    }
};
NpcActor = __decorate([
    ModelExtension('NpcActor')
], NpcActor);
export { NpcActor };
//# sourceMappingURL=NpcActor.js.map
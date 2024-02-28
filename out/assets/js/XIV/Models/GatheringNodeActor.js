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
import { GatheringNodeActor as GeneratedGatheringNodeActor } from "@/XIV/Models/Generated/GatheringNodeActor";
let GatheringNodeActor = class GatheringNodeActor extends GeneratedGatheringNodeActor {
    constructor() {
        super(...arguments);
        this.isUnspoiled = false;
    }
    __init__() {
        const specialGatheringNodeNames = [
            'Unspoiled',
            'Ephemeral',
            'Legendary',
            'Aetherial',
        ];
        // Test if this node is unspoiled.
        if (specialGatheringNodeNames.includes(this.name)) {
            this.iconId = this.altIconId;
            this.isUnspoiled = true;
        }
    }
};
GatheringNodeActor = __decorate([
    ModelExtension('GatheringNodeActor')
], GatheringNodeActor);
export { GatheringNodeActor };
//# sourceMappingURL=GatheringNodeActor.js.map
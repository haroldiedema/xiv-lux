/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ModelExtension } from "@/System/Serializer";
import { GatheringNodeActor as GeneratedGatheringNodeActor } from "@/XIV/Models/Generated/GatheringNodeActor";

@ModelExtension('GatheringNodeActor')
export class GatheringNodeActor extends GeneratedGatheringNodeActor
{
    public isUnspoiled: boolean = false;

    __init__(): void
    {
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
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ModelExtension } from "@/System/Serializer";
import { PlayerActor } from "@/XIV/Models/PlayerActor";
import { NpcActor as GeneratedNpcActor } from "@/XIV/Models/Generated/NpcActor";
import { GatheringNodeActor } from "@/XIV/Models/Generated/GatheringNodeActor";

@ModelExtension('NpcActor')
export class NpcActor extends GeneratedNpcActor
{
    public target: PlayerActor | NpcActor | GatheringNodeActor | null = null;
    public rankName: string = '';

    __init__()
    {
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
}

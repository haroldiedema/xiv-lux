/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ModelExtension } from "@/System/Serializer";
import { GatheringNodeActor, NpcActor } from "@/XIV/Models/Generated";
import { PlayerActor as GeneratedPlayerActor } from "@/XIV/Models/Generated/PlayerActor";

@ModelExtension('PlayerActor')
export class PlayerActor extends GeneratedPlayerActor
{
    public target: PlayerActor | NpcActor | GatheringNodeActor | null = null;

    public isGatherer: boolean = false;
    public isCrafter: boolean = false;

    __init__(): void
    {
        this.isCrafter = this.jobId >= 8 && this.jobId <= 15;
        this.isGatherer = this.jobId >= 16 && this.jobId <= 18;
    }
}

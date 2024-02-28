/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { IRaycasterHandler } from "@/App/Applets/WorldMap/Interaction/Handlers/IRaycasterHandler";
import { RaycasterCandidate } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Inject, Service } from "@/System/Services";
import { Invoker } from "@/System/Socket";

@Service({ tags: ['world-map.raycaster.handler'] })
export class AetheryteHandler implements IRaycasterHandler
{
    @Inject private readonly invoker: Invoker;

    /**
     * @inheritdoc
     */
    public supports(candidate: RaycasterCandidate): boolean
    {
        return typeof candidate.metadata?.aetheryteId === 'number';
    }

    /**
     * @inheritdoc
     */
    public handle(candidate: RaycasterCandidate): void
    {
        this.invoker.aetheryte.teleport(candidate.metadata.aetheryteId);
    }
}

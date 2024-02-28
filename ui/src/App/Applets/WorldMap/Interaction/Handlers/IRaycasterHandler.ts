/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { RaycasterCandidate } from "@/App/Applets/WorldMap/Interaction/Raycaster";

export interface IRaycasterHandler
{
    supports(candidate: RaycasterCandidate): boolean;

    handle(candidate: RaycasterCandidate): void;
}
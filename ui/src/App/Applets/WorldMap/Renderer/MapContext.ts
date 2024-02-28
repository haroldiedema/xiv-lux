/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Vec2 } from "@/XIV/Models";
import { Zone } from "@/XIV/Models/Generated";

export class MapContext
{
    /**
     * True if the current zone is the one the player is currently in.
     */
    public isCurrentZone: boolean = false;

    /**
     * The zone to render.
     */
    public zone: Zone | null = null;

    /**
     * The position to center the camera on.
     * If no position is set, the camera will center on the player or the target.
     */
    public focusPosition: Vec2 | null = null;
}

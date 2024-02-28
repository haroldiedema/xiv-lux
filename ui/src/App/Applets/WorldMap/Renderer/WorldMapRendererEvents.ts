/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Zone } from "@/XIV/Models/Generated";

export type WorldMapRendererEvents = {
    'current-zone-changed': Zone;
    'selected-zone-changed': Zone;
    'custom-offset-activated': void;
    'custom-offset-deactivated': void;
};

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ModelExtension } from "@/System/Serializer";
import { StaticMarker as GeneratedStaticMarker } from "@/XIV/Models/Generated/StaticMarker";

@ModelExtension('StaticMarker')
export class StaticMarker extends GeneratedStaticMarker
{
    public hash: string = null;

    __init__(): void
    {
        this.hash = `${this.kind}-${this.iconId}-${this.position.x}-${this.position.y}`;
    }
}

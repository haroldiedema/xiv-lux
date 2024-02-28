/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AppletConfig } from "@/System/Applet/AppletContext";
import { AbstractComponent } from "@/System/Interface";

export abstract class AbstractApplet extends AbstractComponent
{
    protected context: AppletConfig;

    public close(): void
    {
        this.$host.dispatchEvent(new CustomEvent('close', { bubbles: false }));
        setTimeout(() => this.$host.remove(), 1);
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { AbstractComponent } from "@/System/Interface";
export class AbstractApplet extends AbstractComponent {
    close() {
        this.$host.dispatchEvent(new CustomEvent('close', { bubbles: false }));
        setTimeout(() => this.$host.remove(), 1);
    }
}
//# sourceMappingURL=AbstractApplet.js.map
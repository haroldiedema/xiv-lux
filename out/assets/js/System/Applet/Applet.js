/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { AppletRepository } from "@/System/Applet/AppletRepository";
import { UIComponent } from "@/System/Interface";
/**
 * @autoload
 */
export function Applet(name, options = {}) {
    return function (target) {
        UIComponent(name, options.styleUrl)(target);
        AppletRepository.register(name, Object.assign({
            windowTitle: name,
            minWidth: 512,
            minHeight: 256,
            isSingleInstance: false,
            isFrameless: false
        }, options));
    };
}
//# sourceMappingURL=Applet.js.map
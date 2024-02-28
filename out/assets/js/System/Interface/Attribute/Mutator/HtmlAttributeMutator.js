/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AttributeMutator } from '@/System/Interface/Attribute';
/**
 * Replaces the contents of the element with a raw HTML value that has been
 * passed to the "html:raw" attribute.
 */
let HtmlAttributeMutator = class HtmlAttributeMutator {
    /**
     * @inheritDoc
     */
    mutate(task) {
        if (task.name !== 'html:raw') {
            return false;
        }
        const el = task.node.isHost ? task.node.hostElement : task.node.element;
        if (typeof task.data === 'object') {
            el.appendChild(task.data);
        }
        else {
            el.innerHTML = task.data;
        }
        return true;
    }
};
HtmlAttributeMutator = __decorate([
    AttributeMutator(1)
], HtmlAttributeMutator);
export { HtmlAttributeMutator };
//# sourceMappingURL=HtmlAttributeMutator.js.map
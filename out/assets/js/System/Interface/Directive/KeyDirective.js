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
import { AbstractDirective, Directive } from '@/System/Interface/Directive';
let KeyDirective = class KeyDirective extends AbstractDirective {
    /**
     * @inheritdoc
     */
    execute(node, host, enqueueTask) {
        node.attributes['key'] = this.value;
    }
    /**
     * @inheritdoc
     */
    dispose(node, host, enqueueTask) {
    }
};
KeyDirective = __decorate([
    Directive('key')
], KeyDirective);
export { KeyDirective };
//# sourceMappingURL=KeyDirective.js.map
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
import { MutationType } from '@/System/Interface/Attribute';
import { AbstractDirective, Directive } from '@/System/Interface/Directive';
let BindDirective = class BindDirective extends AbstractDirective {
    constructor() {
        super(...arguments);
        this.isBound = false;
    }
    /**
     * @inheritDoc
     */
    execute(node, host, enqueueTask) {
        const value = host.$component[this.value];
        const valueKey = node.type === 'input' && node.attributes.type === 'checkbox' ? 'checked' : 'value';
        const listener = (e) => host.$component[this.value] = e.target[valueKey];
        if (!this.isBound) {
            enqueueTask({
                type: MutationType.UPDATE,
                node: node,
                name: 'on:input',
                data: listener,
                prev: null,
            });
            this.isBound = true;
        }
        if (value === node.attributes.value) {
            return;
        }
        enqueueTask({
            type: undefined === node.attributes.value ? MutationType.CREATE : MutationType.UPDATE,
            node: node,
            name: valueKey,
            data: value,
            prev: null,
        });
        node.attributes.value = value;
    }
    /**
     * @inheritDoc
     */
    dispose(node, host, enqueueTask) {
        if (!this.isBound) {
            return;
        }
        enqueueTask({
            type: MutationType.REMOVE,
            node: node,
            name: 'value',
            data: undefined,
            prev: null,
        });
        enqueueTask({
            type: MutationType.REMOVE,
            node: node,
            name: 'on:input',
            data: undefined,
            prev: null,
        });
    }
};
BindDirective = __decorate([
    Directive('bind')
], BindDirective);
export { BindDirective };
//# sourceMappingURL=BindDirective.js.map
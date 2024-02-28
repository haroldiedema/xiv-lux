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
import { UIElement } from '@/System/Interface/Element';
import { AttributeMutator, MutationType } from '@/System/Interface/Attribute';
/**
 * Applies any attributes that aren't picked up by other mutators.
 */
let MiscAttributeMutator = class MiscAttributeMutator {
    /**
     * @inheritDoc
     */
    mutate(task) {
        // Nothing to do if previous is equal to the new value.
        if (task.data === task.prev) {
            return false;
        }
        const element = (task.node.isHost ? task.node.hostElement : task.node.element);
        switch (task.type) {
            case MutationType.UPDATE:
            case MutationType.CREATE:
                if (this.isComplexType(task.data)) {
                    if (null === task.data || undefined === task.data) {
                        element[task.name] = null;
                        element.removeAttribute(task.name);
                    }
                    else {
                        element[task.name] = task.data;
                    }
                    // Complex types aren't applied to the component instance
                    // because HTMLElement attributes must be strings...
                    if (element instanceof UIElement) {
                        element.$component[task.name] = task.data;
                    }
                }
                else {
                    if (false === task.data) {
                        element.setAttribute(task.name, false);
                        element.removeAttribute(task.name);
                    }
                    else {
                        element.setAttribute(task.name, String(task.data));
                    }
                }
                break;
            case MutationType.REMOVE:
                element.removeAttribute(task.name);
                break;
        }
        return true;
    }
    isComplexType(value) {
        if (value === null)
            return false;
        return typeof value === 'function'
            || typeof value === 'undefined'
            || typeof value === 'object';
    }
};
MiscAttributeMutator = __decorate([
    AttributeMutator(Infinity)
], MiscAttributeMutator);
export { MiscAttributeMutator };
//# sourceMappingURL=MiscAttributeMutator.js.map
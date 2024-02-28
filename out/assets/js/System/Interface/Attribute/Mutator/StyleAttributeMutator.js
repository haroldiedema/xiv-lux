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
 * Applies any attributes that aren't picked up by other mutators.
 */
let StyleAttributeMutator = class StyleAttributeMutator {
    /**
     * @inheritDoc
     */
    mutate(task) {
        if (task.name !== 'style') {
            return false;
        }
        const element = (task.node.isHost ? task.node.hostElement : task.node.element);
        if (typeof task.data === 'string') {
            element.setAttribute('style', task.data);
            return true;
        }
        if (typeof task.prev === 'string') {
            element.removeAttribute('style');
        }
        if (typeof task.data !== 'object' || !task.data === null) {
            element.removeAttribute('style');
            return true;
        }
        const toRemove = Object.keys(task.prev ?? {}).filter(rule => !(rule in (task.data ?? {})));
        for (const rule of toRemove) {
            if (rule.startsWith('--')) {
                element.style.setProperty(rule, null);
            }
            else {
                element.style[rule] = undefined;
            }
        }
        Object.keys(task.data).forEach((rule) => {
            if (rule.startsWith('--')) {
                element.style.setProperty(rule, task.data[rule]);
            }
            else {
                element.style[rule] = task.data[rule];
            }
        });
        return true;
    }
};
StyleAttributeMutator = __decorate([
    AttributeMutator(1)
], StyleAttributeMutator);
export { StyleAttributeMutator };
//# sourceMappingURL=StyleAttributeMutator.js.map
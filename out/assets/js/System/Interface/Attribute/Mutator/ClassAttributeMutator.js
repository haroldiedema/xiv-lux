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
 * Applies classes to the element as defined in the "class"-attribute.
 *
 * The "class" or "className" attribute can be specified with objects or strings
 * values. These are normalized to string values in the JSX element factory.
 */
let ClassAttributeMutator = class ClassAttributeMutator {
    /**
     * @inheritDoc
     */
    mutate(task) {
        if (task.name !== 'class') {
            return false;
        }
        const element = task.node.isHost ? task.node.hostElement : task.node.element;
        const classList = task.data?.trim().length > 0 ? task.data?.split(' ') ?? [] : [];
        element.classList.forEach((cls) => {
            if (cls && !classList.includes(cls)) {
                element.classList.remove(cls);
            }
        });
        classList.forEach((cls) => {
            if (cls && !element.classList.contains(cls)) {
                element.classList.add(cls);
            }
        });
        return true;
    }
};
ClassAttributeMutator = __decorate([
    AttributeMutator(1)
], ClassAttributeMutator);
export { ClassAttributeMutator };
//# sourceMappingURL=ClassAttributeMutator.js.map
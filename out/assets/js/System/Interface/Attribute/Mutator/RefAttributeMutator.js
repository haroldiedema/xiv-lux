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
let RefAttributeMutator = class RefAttributeMutator {
    /**
     * @inheritDoc
     */
    mutate(task) {
        if (task.name !== 'ref') {
            return false;
        }
        if (typeof task.data !== 'function') {
            throw new Error(`A "ref" attribute should provide a function.`);
        }
        const element = task.node.isHost ? task.node.hostElement : task.node.element;
        task.data(element);
        return true;
    }
};
RefAttributeMutator = __decorate([
    AttributeMutator(1)
], RefAttributeMutator);
export { RefAttributeMutator };
//# sourceMappingURL=RefAttributeMutator.js.map
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { AttributeMutatorRegistry } from '@/System/Interface/Attribute/AttributeMutatorRegistry';
/**
 * @autoload-context host
 */
export function AttributeMutator(priority) {
    return (target) => {
        AttributeMutatorRegistry.registerMutator(target, priority);
    };
}
//# sourceMappingURL=AttributeMutator.js.map
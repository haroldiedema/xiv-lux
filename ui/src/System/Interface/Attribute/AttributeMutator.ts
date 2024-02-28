/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AttributeMutatorRegistry } from '@/System/Interface/Attribute/AttributeMutatorRegistry';
import { IAttributeMutator } from '@/System/Interface/Attribute/IAttributeMutator';

/**
 * @autoload-context host
 */
export function AttributeMutator(priority: number)
{
    return (target: new () => IAttributeMutator) =>
    {
        AttributeMutatorRegistry.registerMutator(target, priority);
    };
}

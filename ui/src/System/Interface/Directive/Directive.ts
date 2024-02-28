/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractDirective } from '@/System/Interface/Directive';
import { DirectiveRegistry } from '@/System/Interface/Directive/DirectiveRegistry';

/**
 * @autoload-context host
 */
export function Directive(name: string)
{
    return (target: new (value: any) => AbstractDirective) =>
    {
        DirectiveRegistry.set(name, target);
    };
}

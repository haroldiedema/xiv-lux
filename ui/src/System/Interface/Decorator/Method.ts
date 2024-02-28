/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent } from '@/System/Interface';
import { ComponentConstructor } from '@/System/Interface/Component';

export function Method(target: AbstractComponent, propertyKey: string)
{
    const ctor = (target.constructor as ComponentConstructor<AbstractComponent>);

    if (typeof ctor.__metadata__ === 'undefined') {
        ctor.__metadata__ = { watchers: {}, attributes: [], methods: [] };
    } else if (typeof ctor.__metadata__.methods === 'undefined') {
        ctor.__metadata__.methods = [];
    }

    ctor.__metadata__.methods.push(propertyKey);
}

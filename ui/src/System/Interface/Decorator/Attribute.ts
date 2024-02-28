/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent } from '@/System/Interface';
import { ComponentConstructor } from '@/System/Interface/Component';

export function Attribute(target: AbstractComponent, propertyKey: string)
{
    const ctor = (target.constructor as ComponentConstructor<AbstractComponent>);
    const type = Reflect.getMetadata('design:type', target, propertyKey);

    if (typeof ctor.__metadata__ === 'undefined') {
        ctor.__metadata__ = { watchers: {}, attributes: [] };
    } else if (typeof ctor.__metadata__.attributes === 'undefined') {
        ctor.__metadata__.attributes = [];
    }

    ctor.__metadata__.attributes.push({ name: propertyKey, type: type });
}

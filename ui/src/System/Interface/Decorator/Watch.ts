/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent } from '@/System/Interface';
import { ComponentConstructor } from '@/System/Interface/Component';

export function Watch(propertyName: string, immediate: boolean = false)
{
    return (target: AbstractComponent, propertyKey: string) =>
    {
        const ctor = (target.constructor as ComponentConstructor<AbstractComponent>);

        if (typeof ctor.__metadata__ === 'undefined') {
            ctor.__metadata__ = { watchers: {}, attributes: [] };
        } else if (typeof ctor.__metadata__.watchers === 'undefined') {
            ctor.__metadata__.watchers = {};
        }

        if (typeof ctor.__metadata__.watchers[propertyName] === 'undefined') {
            ctor.__metadata__.watchers[propertyName] = [];
        }

        ctor.__metadata__.watchers[propertyName].push({
            methodName: propertyKey,
            immediate: immediate,
        });
    };
}

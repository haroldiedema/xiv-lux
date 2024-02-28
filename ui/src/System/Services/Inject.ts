/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import 'reflect-metadata';

/**
 * Injects a service instance into the decorated property.
 */
export function Inject(target: any, propertyKey: string): void
{
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    const deps = Reflect.getMetadata('lux:deps:single', target.constructor) ?? {};

    deps[propertyKey] = type;

    Reflect.defineMetadata('lux:deps:single', deps, target.constructor);
}

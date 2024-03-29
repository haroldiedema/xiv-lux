/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
/**
 * Injects an array of service instances tagged with the given tag.
 */
export function InjectTagged(tag) {
    return function (target, propertyKey) {
        const deps = Reflect.getMetadata('lux:deps:tagged', target.constructor) ?? {};
        deps[propertyKey] = tag;
        Reflect.defineMetadata('lux:deps:tagged', deps, target.constructor);
    };
}
//# sourceMappingURL=InjectTagged.js.map
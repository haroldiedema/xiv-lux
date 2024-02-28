/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export function Attribute(target, propertyKey) {
    const ctor = target.constructor;
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    if (typeof ctor.__metadata__ === 'undefined') {
        ctor.__metadata__ = { watchers: {}, attributes: [] };
    }
    else if (typeof ctor.__metadata__.attributes === 'undefined') {
        ctor.__metadata__.attributes = [];
    }
    ctor.__metadata__.attributes.push({ name: propertyKey, type: type });
}
//# sourceMappingURL=Attribute.js.map
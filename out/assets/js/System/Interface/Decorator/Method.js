/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export function Method(target, propertyKey) {
    const ctor = target.constructor;
    if (typeof ctor.__metadata__ === 'undefined') {
        ctor.__metadata__ = { watchers: {}, attributes: [], methods: [] };
    }
    else if (typeof ctor.__metadata__.methods === 'undefined') {
        ctor.__metadata__.methods = [];
    }
    ctor.__metadata__.methods.push(propertyKey);
}
//# sourceMappingURL=Method.js.map
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export function Watch(propertyName, immediate = false) {
    return (target, propertyKey) => {
        const ctor = target.constructor;
        if (typeof ctor.__metadata__ === 'undefined') {
            ctor.__metadata__ = { watchers: {}, attributes: [] };
        }
        else if (typeof ctor.__metadata__.watchers === 'undefined') {
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
//# sourceMappingURL=Watch.js.map
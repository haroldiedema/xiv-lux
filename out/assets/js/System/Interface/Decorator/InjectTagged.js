/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export function InjectTagged(...tags) {
    return function (target, propertyKey) {
        target['__service_refs__'] = target['__service_refs__'] ?? [];
        target['__service_refs__'].push({
            key: propertyKey,
            kind: 'tagged',
            tags: tags,
        });
    };
}
//# sourceMappingURL=InjectTagged.js.map
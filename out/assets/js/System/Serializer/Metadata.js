/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import 'reflect-metadata';
export function GetMetadataOf(target) {
    if (!Reflect.hasOwnMetadata('model:metadata', target)) {
        Reflect.defineMetadata('model:metadata', {
            kind: null,
            ctor: target,
            keys: new Map()
        }, target);
    }
    return Reflect.getOwnMetadata('model:metadata', target);
}
export function HasMetadata(target) {
    return Reflect.hasOwnMetadata('model:metadata', target);
}
//# sourceMappingURL=Metadata.js.map
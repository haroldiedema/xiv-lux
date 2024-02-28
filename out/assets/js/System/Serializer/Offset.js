/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { GetMetadataOf } from "@/System/Serializer/Metadata";
export function Offset(offset) {
    return (target, name) => {
        const metadata = GetMetadataOf(target.constructor);
        const offset = metadata.keys.size;
        metadata.keys.set(name, { name, offset, transform: v => v });
    };
}
//# sourceMappingURL=Offset.js.map
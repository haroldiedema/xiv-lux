/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { GetMetadataOf } from "@/System/Serializer/Metadata";

export function Id(target: any, name: string)
{
    const metadata = GetMetadataOf(target.constructor);
    metadata.keys.get(name).transform = IdTransform;
}

function IdTransform(value: string)
{
    if (!value || value === 'E0000000') {
        return null;
    }

    return value;
}
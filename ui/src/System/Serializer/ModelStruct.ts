/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { GetMetadataOf, ModelKey } from "@/System/Serializer/Metadata";
import { ModelFactory } from "@/System/Serializer/ModelFactory";

/**
 * Marks the decorated class as a model struct that can be deserialized from an
 * event stream payload that is received from the server.
 *
 * @autoload
 */
export function ModelStruct(kind: string)
{
    return function (target: new () => any)
    {
        const metadata = GetMetadataOf(target);
        const offsets = new Map<string, ModelKey>();

        metadata.kind = kind;
        metadata.ctor = target;
        // metadata.offsets = extractOffsetsFrom(target, offsets);

        ModelFactory.repository.set(kind, metadata);
    };
}

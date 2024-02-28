/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { GetMetadataOf } from "@/System/Serializer/Metadata";
import { ModelFactory } from "@/System/Serializer/ModelFactory";

/**
 * Marks the decorated class as an override of a model struct defined by the
 * given name.
 *
 * @autoload
 */
export function ModelExtension(kind: string)
{
    return (target: new () => any) =>
    {
        const metadata = GetMetadataOf(Object.getPrototypeOf(target));
        if (!metadata.kind) {
            throw new Error(`The model "${target.name}" extends from "${Object.getPrototypeOf(target).name}", but this is not a valid model. @ModelOverride can only be used on classes with a parent that is decorated with @ModelStruct.`);
        }

        if (ModelFactory.overrides.has(metadata.kind)) {
            throw new Error(`The model "${metadata.kind}" is already overridden by another class.`);
        }

        ModelFactory.overrides.set(metadata.kind, target);
    };
}
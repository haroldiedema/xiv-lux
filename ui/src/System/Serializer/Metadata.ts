/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ClassDeclaration } from "@/System/Types";
import 'reflect-metadata';

export function GetMetadataOf(target: ClassDeclaration): ModelMetadata
{
    if (!Reflect.hasOwnMetadata('model:metadata', target)) {
        Reflect.defineMetadata('model:metadata', {
            kind: null,
            ctor: target,
            keys: new Map()
        }, target);
    }

    return Reflect.getOwnMetadata('model:metadata', target);
}

export function HasMetadata(target: ClassDeclaration): boolean
{
    return Reflect.hasOwnMetadata('model:metadata', target);
}

export type ModelMetadata = {
    kind: string;
    ctor: ClassDeclaration,
    keys: Map<string, ModelKey>;
};

export type ModelKey = {
    name: string;
    offset: number,
    transform?: (value: any) => any;
};
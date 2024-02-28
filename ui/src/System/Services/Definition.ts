/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ServiceTag } from '@/System/Services/ServiceTag';
import { ClassDeclaration } from '@/System/Types';

export class Definition<T extends ClassDeclaration>
{
    constructor(
        public readonly classDeclaration: T,
        public readonly tags: ServiceTag[],
        public readonly initializer: (instance: InstanceType<T>) => Promise<any>,
        public readonly dependencies: Record<string, ClassDeclaration>,
        public readonly taggedDependencies: Record<string, string>,
        public readonly delegateDependencies: Record<string, string>,
        public readonly sharedEventEmitters: string[],
        public readonly ancestors: ClassDeclaration[],
        public readonly fileName: string,
    )
    {
    }
}

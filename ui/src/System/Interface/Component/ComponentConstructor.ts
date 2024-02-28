/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent } from '@/System/Interface';

export type ComponentConstructor<T extends AbstractComponent> = (new (...args: any[]) => T) & {
    __metadata__?: {
        watchers?: {
            [name: string]: {
                methodName: string,
                immediate: boolean,
            }[];
        },
        attributes?: ({ name: string, type: Function; })[];
        methods?: string[];
    },

    __lux_module_id__?: {
        [name: string]: string;
    };
};

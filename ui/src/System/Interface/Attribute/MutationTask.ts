/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { VNode } from '@/System/Interface/Node';

export type MutationTask = {
    node: VNode;
    name: string;
    type: MutationType;
    data: any;
    prev: any;
};

export enum MutationType
{
    CREATE = 0,
    REMOVE = 1,
    UPDATE = 2,
}

export type EnqueueTaskFn = (task: MutationTask) => any;

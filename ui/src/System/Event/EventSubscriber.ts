/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventEmitter } from '@/System/Event/EventEmitter';

export class EventSubscriber<T>
{
    constructor(
        private readonly eb: EventEmitter<any>,
        public readonly name: string,
        private readonly fn: Function,
    )
    {
    }

    public invoke(args: T): void
    {
        this.fn(args);
    }

    public unsubscribe(): void
    {
        this.eb.unsubscribe(this);
    }
}

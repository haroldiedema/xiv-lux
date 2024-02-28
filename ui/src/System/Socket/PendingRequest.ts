/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventEmitter } from "@/System/Event";
import { Timeout } from "@/System/Types";

type PendingRequestEvents = {
    'timed-out': void;
};

export class PendingRequest extends EventEmitter<PendingRequestEvents>
{
    private static nextId = 0;

    public readonly id = (++PendingRequest.nextId);
    private readonly timeout: Timeout;

    constructor(
        private readonly resolve: (value: any) => void,
        private readonly reject: (reason?: any) => void,
    )
    {
        super();

        this.timeout = setTimeout(() =>
        {
            this.dispatch('timed-out');
            this.fail('Request timed out.');
        }, 5000);
    }

    public complete(value: any): void
    {
        clearTimeout(this.timeout);
        this.resolve(value);
    }

    public fail(reason: any): void
    {
        clearTimeout(this.timeout);
        this.reject(reason);
    }
}
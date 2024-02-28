/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { PendingRequest } from "@/System/Socket/PendingRequest";

export class RequestQueue
{
    private readonly queue: Map<number, PendingRequest> = new Map();

    /**
     * Enqueue a new request and return the serialized payload.
     */
    public enqueue(command: string, args: any[], resolve: (value: any) => any, reject: (reason?: string) => void): string
    {
        const request = new PendingRequest(resolve, reject);
        this.queue.set(request.id, request);

        request.once('timed-out', () => this.queue.delete(request.id));

        return JSON.stringify({
            Id: request.id,
            Command: command,
            Arguments: args,
        });
    }

    /**
     * Resolves a request with the given ID.
     */
    public tryDequeue(id: number, value: any, isError: boolean): void
    {
        const request = this.queue.get(id);
        if (!request) {
            return;
        }

        this.queue.delete(id);

        if (isError) {
            request.fail(value);
        } else {
            request.complete(value);
        }
    }
}
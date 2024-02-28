/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { PendingRequest } from "@/System/Socket/PendingRequest";
export class RequestQueue {
    constructor() {
        this.queue = new Map();
    }
    /**
     * Enqueue a new request and return the serialized payload.
     */
    enqueue(command, args, resolve, reject) {
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
    tryDequeue(id, value, isError) {
        const request = this.queue.get(id);
        if (!request) {
            return;
        }
        this.queue.delete(id);
        if (isError) {
            request.fail(value);
        }
        else {
            request.complete(value);
        }
    }
}
//# sourceMappingURL=RequestQueue.js.map
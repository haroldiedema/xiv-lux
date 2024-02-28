/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { EventEmitter } from "@/System/Event";
export class PendingRequest extends EventEmitter {
    static { this.nextId = 0; }
    constructor(resolve, reject) {
        super();
        this.resolve = resolve;
        this.reject = reject;
        this.id = (++PendingRequest.nextId);
        this.timeout = setTimeout(() => {
            this.dispatch('timed-out');
            this.fail('Request timed out.');
        }, 5000);
    }
    complete(value) {
        clearTimeout(this.timeout);
        this.resolve(value);
    }
    fail(reason) {
        clearTimeout(this.timeout);
        this.reject(reason);
    }
}
//# sourceMappingURL=PendingRequest.js.map
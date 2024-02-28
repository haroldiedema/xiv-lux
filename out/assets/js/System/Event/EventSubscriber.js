/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class EventSubscriber {
    constructor(eb, name, fn) {
        this.eb = eb;
        this.name = name;
        this.fn = fn;
    }
    invoke(args) {
        this.fn(args);
    }
    unsubscribe() {
        this.eb.unsubscribe(this);
    }
}
//# sourceMappingURL=EventSubscriber.js.map
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class Scheduler {
    constructor(element) {
        this.element = element;
        this.isEnabled = false;
        this.updateRef = null;
    }
    enable() {
        this.isEnabled = true;
    }
    scheduleUpdate(callback) {
        if (false === this.isEnabled || null !== this.updateRef) {
            return;
        }
        this.updateRef = setTimeout(() => {
            this.updateRef = null;
            callback();
        }, 0);
    }
}
//# sourceMappingURL=Scheduler.js.map
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { EventEmitter } from "@/System/Event";
export class AppletConfig extends EventEmitter {
    constructor(options, argument) {
        super();
        this.argument = argument;
        this._name = '';
        this._description = '';
        this._isFrameless = false;
        this._name = options.name;
        this._description = options.description;
        this._isFrameless = options.isFrameless;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        this.dispatch('name', value);
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
        this.dispatch('description', value);
    }
    get isFrameless() {
        return this._isFrameless;
    }
    set isFrameless(value) {
        this._isFrameless = value;
        this.dispatch('isFrameless', value);
    }
}
//# sourceMappingURL=AppletContext.js.map
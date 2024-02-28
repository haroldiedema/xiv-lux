/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export const AppletRepository = new class {
    constructor() {
        this.applets = new Map();
    }
    register(name, options) {
        this.applets.set(name, { tagName: name, options: options });
    }
    get(name) {
        return this.applets.get(name);
    }
    has(name) {
        return this.applets.has(name);
    }
    get names() {
        return Array.from(this.applets.keys());
    }
    get singletonNames() {
        return this.names.filter(name => this.applets.get(name).options.isSingleInstance);
    }
};
//# sourceMappingURL=AppletRepository.js.map
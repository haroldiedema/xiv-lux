/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class Metadata {
    constructor(Component) {
        this.isRendering = false;
        this.dirtyProps = new Set();
        this.watchers = new Map();
        this.attributes = new Map();
        this.methods = new Set();
        if (typeof Component.__metadata__?.watchers !== 'undefined') {
            Object.keys(Component.__metadata__.watchers).forEach((name) => {
                this.watchers.set(name, Component.__metadata__.watchers[name]);
            });
        }
        if (typeof Component.__metadata__?.attributes !== 'undefined') {
            for (const attribute of Component.__metadata__?.attributes) {
                this.attributes.set(attribute.name, attribute.type);
            }
        }
        if (typeof Component.__metadata__?.methods !== 'undefined') {
            for (const method of Component.__metadata__?.methods) {
                this.methods.add(method);
            }
        }
    }
}
//# sourceMappingURL=Metadata.js.map
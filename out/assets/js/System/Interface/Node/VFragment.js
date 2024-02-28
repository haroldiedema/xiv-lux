/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class VFragment {
    constructor(text) {
        this.text = text;
        this.element = null;
        this.parent = null;
        this.index = -1;
        /**
         * A list of mutator functions that mutate this node's element during the
         * rendering process.
         */
        this.mutators = [];
    }
    /**
     * Adds the mutator functions to create the initial node.
     */
    create() {
        this.mutators.push(() => {
            this.element = document.createTextNode(String(this.text));
            this.parent?.element?.appendChild(this.element);
        });
    }
    render() {
        while (true) {
            const mutator = this.mutators.shift();
            if (!mutator) {
                break;
            }
            mutator();
        }
    }
    /**
     * Patch this node with the data of the given node and adds mutator
     * functions to patch the DOM node based on the detected changes.
     */
    patch(node) {
        if (this.text !== node.text) {
            this.text = node.text;
            this.mutators.push(() => this.element.textContent = String(this.text));
        }
        return this;
    }
    /**
     * Dispose of this node.
     */
    dispose() {
        if (this.element?.parentNode) {
            this.element.remove();
            this.element = null;
        }
    }
}
//# sourceMappingURL=VFragment.js.map
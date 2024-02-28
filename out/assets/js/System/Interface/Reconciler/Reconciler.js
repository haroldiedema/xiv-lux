/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { AttributeMutatorRegistry } from '@/System/Interface/Attribute';
export class Reconciler {
    constructor(hostElement) {
        this.hostElement = hostElement;
        this.vDOM = null;
    }
    /**
     * Reconcile the given node with the previous version.
     */
    reconcile() {
        this.hostElement.$component.onBeforeRender();
        const node = this.hostElement.$component.render();
        if (null === this.vDOM) {
            this.vDOM = node;
            this.initHostElement();
            this.vDOM.create();
        }
        else {
            // Keep it simple. The DOM patches itself where needed and returns a
            // VNode instance in case the entire tree should be re-rendered.
            const result = this.vDOM.patch(node);
            if (result !== this.vDOM) {
                this.vDOM.dispose();
                this.vDOM = result;
                this.initHostElement();
                this.vDOM.create();
            }
        }
        // Invoke mutators.
        this.vDOM.render(this.hostElement, task => this.runMutationTask(task));
        // Render to the host container.
        if (false === this.vDOM.isHost && !this.vDOM.element.parentNode) {
            this.hostElement.shadowRoot.appendChild(this.vDOM.element);
        }
        this.hostElement.$component.onAfterRender();
    }
    initHostElement() {
        if (!this.vDOM.isHost) {
            return;
        }
        this.vDOM.hostElement = this.hostElement;
        this.vDOM.element = this.hostElement.shadowRoot;
        if (this.hostElement.classList.length > 0) {
            this.vDOM.attributes['class'] += ' ' + this.hostElement.getAttribute('class');
            this.vDOM.attributes['class'] = this.vDOM.attributes['class'].trim();
        }
    }
    /**
     * Applies the given mutation task.
     *
     * @private
     */
    runMutationTask(task) {
        AttributeMutatorRegistry.getInstance().mutate(task);
    }
}
//# sourceMappingURL=Reconciler.js.map
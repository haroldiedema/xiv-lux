/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { EventEmitter } from '@/System/Event';
export class AbstractComponent extends EventEmitter {
    constructor($host) {
        super();
        this.$host = $host;
    }
    /**
     * Invoked when the element is initially created.
     *
     * This lifecycle callback is invoked once during the lifetime of this
     * component.
     */
    onCreated() {
    }
    /**
     * Invoked when the element has been mounted into the DOM.
     *
     * This method is invoked only once for during lifetime of the component. It
     * follows the same semantics as the Web-Component "connectedCallback"
     * lifecycle callback.
     */
    onMounted() {
    }
    /**
     * Invoked when this element is being disposed of.
     *
     * This lifecycle callback follows the same semantics as the Web-Component
     * "disconnectedCallback" lifecycle callback.
     */
    onDisposed() {
    }
    /**
     * Invoked every time before the {@link AbstractComponent.render} method is
     * being invoked.
     */
    onBeforeRender() {
    }
    /**
     * Invoked every time after this element has been rendered in full.
     */
    onAfterRender() {
    }
    /**
     * Enqueues the given task to be executed before the next render cycle.
     *
     * This method is useful when you want to update a property of this
     * component, but you don't have control over when the property is
     * updated. For example, when you're receiving data from a WebSocket.
     *
     * This ensures that the component is not being mutated during a render
     * cycle, which could lead to unexpected behavior.
     */
    enqueueTask(task) {
        this.$host.enqueueTask(task);
    }
    /**
     * Enqueues the given task to be executed after the next render cycle.
     */
    enqueueDeferredTask(task) {
        this.$host.enqueueTask(() => {
            // Delay to next frame.
            setTimeout(() => this.$host.enqueueTask(() => task()), 1);
        });
    }
}
//# sourceMappingURL=AbstractComponent.js.map
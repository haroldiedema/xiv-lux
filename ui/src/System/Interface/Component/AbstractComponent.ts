/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventEmitter } from '@/System/Event';
import { UIElement } from '@/System/Interface/Element';
import { VNode } from '@/System/Interface/Node';

type ComponentEvents = {
    disposed: void;
};

export abstract class AbstractComponent extends EventEmitter<ComponentEvents>
{
    constructor(protected readonly $host: UIElement<AbstractComponent>)
    {
        super();
    }

    public abstract render(): VNode;

    /**
     * Invoked when the element is initially created.
     *
     * This lifecycle callback is invoked once during the lifetime of this
     * component.
     */
    public onCreated(): void | Promise<void>
    {
    }

    /**
     * Invoked when the element has been mounted into the DOM.
     *
     * This method is invoked only once for during lifetime of the component. It
     * follows the same semantics as the Web-Component "connectedCallback"
     * lifecycle callback.
     */
    public onMounted(): void
    {
    }

    /**
     * Invoked when this element is being disposed of.
     *
     * This lifecycle callback follows the same semantics as the Web-Component
     * "disconnectedCallback" lifecycle callback.
     */
    public onDisposed(): void
    {
    }

    /**
     * Invoked every time before the {@link AbstractComponent.render} method is
     * being invoked.
     */
    public onBeforeRender(): void
    {
    }

    /**
     * Invoked every time after this element has been rendered in full.
     */
    public onAfterRender(): void
    {
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
    protected enqueueTask(task: () => any): void
    {
        this.$host.enqueueTask(task);
    }

    /**
     * Enqueues the given task to be executed after the next render cycle.
     */
    protected enqueueDeferredTask(task: () => any): void
    {
        this.$host.enqueueTask(() =>
        {
            // Delay to next frame.
            setTimeout(() => this.$host.enqueueTask(() => task()), 1);
        });
    }
}

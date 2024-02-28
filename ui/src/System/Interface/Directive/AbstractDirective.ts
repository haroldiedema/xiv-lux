/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, UIElement } from '@/System/Interface';
import { EnqueueTaskFn } from '@/System/Interface/Attribute';
import { VNode } from '@/System/Interface/Node';

export abstract class AbstractDirective
{
    private isDisposed: boolean = false;

    constructor(public readonly value: any)
    {
    }

    /**
     * Invokes the {@link AbstractDirective.dispose} method rather than the
     * {@link AbstractDirective.execute} method on the next render iteration.
     */
    public markForDisposal(): void
    {
        this.isDisposed = true;
    }

    public run(node: VNode, host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void
    {
        if (this.isDisposed) {
            return this.dispose(node, host, enqueueTask);
        }

        return this.execute(node, host, enqueueTask);
    }

    /**
     * Runs the directive for the given node and host element.
     * Returns a list of mutations to apply to the given node.
     */
    protected abstract execute(node: VNode, host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void;

    /**
     * Invoked when this directive is being disposed of.
     */
    protected abstract dispose(node: VNode, host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void;
}

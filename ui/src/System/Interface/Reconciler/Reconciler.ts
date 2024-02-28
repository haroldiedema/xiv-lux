/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, UIElement } from '@/System/Interface';
import { AttributeMutatorRegistry, MutationTask } from '@/System/Interface/Attribute';
import { VNode } from '@/System/Interface/Node';

export class Reconciler
{
    private vDOM: VNode = null;

    constructor(public readonly hostElement: UIElement<AbstractComponent>)
    {

    }

    /**
     * Reconcile the given node with the previous version.
     */
    public reconcile(): void
    {
        this.hostElement.$component.onBeforeRender();
        const node = this.hostElement.$component.render();

        if (null === this.vDOM) {
            this.vDOM = node;

            this.initHostElement();
            this.vDOM.create();
        } else {
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

    private initHostElement(): void
    {
        if (!this.vDOM.isHost) {
            return;
        }

        this.vDOM.hostElement = this.hostElement;
        this.vDOM.element = this.hostElement.shadowRoot as any;

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
    private runMutationTask(task: MutationTask): void
    {
        AttributeMutatorRegistry.getInstance().mutate(task);
    }
}

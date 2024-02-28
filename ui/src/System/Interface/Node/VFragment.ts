/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { VNode } from '@/System/Interface/Node/VNode';

export class VFragment
{
    public element: Text = null;
    public parent?: VNode = null;
    public index: number = -1;

    /**
     * A list of mutator functions that mutate this node's element during the
     * rendering process.
     */
    public mutators: (() => any)[] = [];

    constructor(public text: string | boolean | number)
    {
    }

    /**
     * Adds the mutator functions to create the initial node.
     */
    public create(): void
    {
        this.mutators.push(() =>
        {
            this.element = document.createTextNode(String(this.text));
            this.parent?.element?.appendChild(this.element);
        });
    }

    public render(): void
    {
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
    public patch(node: VFragment): VFragment
    {
        if (this.text !== node.text) {
            this.text = node.text;

            this.mutators.push(() => this.element.textContent = String(this.text));
        }

        return this;
    }

    /**
     * Dispose of this node.
     */
    public dispose(): void
    {
        if (this.element?.parentNode) {
            this.element.remove();
            this.element = null;
        }
    }
}

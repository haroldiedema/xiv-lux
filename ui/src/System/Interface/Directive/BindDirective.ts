/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, UIElement } from '@/System/Interface';
import { EnqueueTaskFn, MutationType } from '@/System/Interface/Attribute';
import { AbstractDirective, Directive } from '@/System/Interface/Directive';
import { VNode } from '@/System/Interface/Node';

@Directive('bind')
export class BindDirective extends AbstractDirective
{
    private isBound: boolean = false;

    /**
     * @inheritDoc
     */
    protected execute(node: VNode, host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void
    {
        const value = (host.$component as any)[this.value];
        const valueKey = node.type === 'input' && node.attributes.type === 'checkbox' ? 'checked' : 'value';
        const listener = (e: any) => (host.$component as any)[this.value] = e.target[valueKey];

        if (!this.isBound) {
            enqueueTask({
                type: MutationType.UPDATE,
                node: node,
                name: 'on:input',
                data: listener,
                prev: null,
            });

            this.isBound = true;
        }

        if (value === node.attributes.value) {
            return;
        }

        enqueueTask({
            type: undefined === node.attributes.value ? MutationType.CREATE : MutationType.UPDATE,
            node: node,
            name: valueKey,
            data: value,
            prev: null,
        });

        node.attributes.value = value;
    }

    /**
     * @inheritDoc
     */
    protected dispose(node: VNode, host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void
    {
        if (!this.isBound) {
            return;
        }

        enqueueTask({
            type: MutationType.REMOVE,
            node: node,
            name: 'value',
            data: undefined,
            prev: null,
        });

        enqueueTask({
            type: MutationType.REMOVE,
            node: node,
            name: 'on:input',
            data: undefined,
            prev: null,
        });
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, UIElement } from '@/System/Interface';
import { EnqueueTaskFn } from '@/System/Interface/Attribute';
import { AbstractDirective, Directive } from '@/System/Interface/Directive';
import { VNode } from '@/System/Interface/Node';

@Directive('key')
export class KeyDirective extends AbstractDirective
{
    /**
     * @inheritdoc
     */
    protected execute(node: VNode, host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void
    {
        node.attributes['key'] = this.value;
    }

    /**
     * @inheritdoc
     */
    protected dispose(node: VNode, host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void
    {
    }
}
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AttributeMutator, IAttributeMutator, MutationTask } from '@/System/Interface/Attribute';

/**
 * Replaces the contents of the element with a raw HTML value that has been
 * passed to the "html:raw" attribute.
 */
@AttributeMutator(1)
export class HtmlAttributeMutator implements IAttributeMutator
{
    /**
     * @inheritDoc
     */
    public mutate(task: MutationTask): boolean
    {
        if (task.name !== 'html:raw') {
            return false;
        }

        const el = task.node.isHost ? task.node.hostElement : task.node.element as Element;

        if (typeof task.data === 'object') {
            el.appendChild(task.data);
        } else {
            el.innerHTML = task.data;
        }

        return true;
    }
}

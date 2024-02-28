/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { UIElement } from '@/System/Interface/Element';
import { AttributeMutator, IAttributeMutator, MutationTask, MutationType } from '@/System/Interface/Attribute';

/**
 * Applies any attributes that aren't picked up by other mutators.
 */
@AttributeMutator(Infinity)
export class MiscAttributeMutator implements IAttributeMutator
{
    /**
     * @inheritDoc
     */
    public mutate(task: MutationTask): boolean
    {
        // Nothing to do if previous is equal to the new value.
        if (task.data === task.prev) {
            return false;
        }

        const element = (task.node.isHost ? task.node.hostElement : task.node.element) as any;

        switch (task.type) {
            case MutationType.UPDATE:
            case MutationType.CREATE:
                if (this.isComplexType(task.data)) {
                    if (null === task.data || undefined === task.data) {
                        element[task.name] = null;
                        element.removeAttribute(task.name);
                    } else {
                        element[task.name] = task.data;
                    }

                    // Complex types aren't applied to the component instance
                    // because HTMLElement attributes must be strings...
                    if (element instanceof UIElement) {
                        element.$component[task.name] = task.data;
                    }
                } else {
                    if (false === task.data) {
                        element.setAttribute(task.name, false);
                        element.removeAttribute(task.name);
                    } else {
                        element.setAttribute(task.name, String(task.data));
                    }
                }
                break;
            case MutationType.REMOVE:
                element.removeAttribute(task.name);
                break;
        }

        return true;
    }

    private isComplexType(value: any): boolean
    {
        if (value === null) return false;

        return typeof value === 'function'
            || typeof value === 'undefined'
            || typeof value === 'object';
    }
}

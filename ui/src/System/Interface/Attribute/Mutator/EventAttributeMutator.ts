/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AttributeMutator, IAttributeMutator, MutationTask, MutationType } from '@/System/Interface/Attribute';

/**
 * Applies any attributes that aren't picked up by other mutators.
 */
@AttributeMutator(10)
export class EventAttributeMutator implements IAttributeMutator
{
    /**
     * @inheritDoc
     */
    public mutate(task: MutationTask): boolean
    {
        if (false === task.name.startsWith('on:')) {
            return false;
        }

        task.node.meta.events = (task.node.meta.events ?? {});

        const isFlow: boolean = task.name.charAt(3) === '$';
        const eventName: string = task.name.substr(isFlow ? 4 : 3);
        const element: Element = task.node.isHost ? task.node.hostElement : task.node.element as Element;

        switch (task.type) {
            case MutationType.UPDATE:
                if (task.node.meta.events[eventName]) {
                    element.removeEventListener(eventName, task.node.meta.events[eventName]);
                }

            // Fall-through.
            case MutationType.CREATE:
                const listener = (e: Event) =>
                {
                    if (!isFlow) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    task.data(e);
                };

                task.node.meta.events[eventName] = listener;
                element.addEventListener(eventName, listener, { passive: false });
                break;
            case MutationType.REMOVE:
                if (task.node.meta.events[eventName]) {
                    element.removeEventListener(eventName, task.node.meta.events[eventName]);
                }
                break;
        }

        return true;
    }
}

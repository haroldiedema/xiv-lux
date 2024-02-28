/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AttributeMutator, IAttributeMutator, MutationTask } from '@/System/Interface/Attribute';

/**
 * Applies any attributes that aren't picked up by other mutators.
 */
@AttributeMutator(1)
export class StyleAttributeMutator implements IAttributeMutator
{
    /**
     * @inheritDoc
     */
    public mutate(task: MutationTask): boolean
    {
        if (task.name !== 'style') {
            return false;
        }

        const element: HTMLElement = (task.node.isHost ? task.node.hostElement : task.node.element) as any;

        if (typeof task.data === 'string') {
            element.setAttribute('style', task.data);
            return true;
        }

        if (typeof task.prev === 'string') {
            element.removeAttribute('style');
        }

        if (typeof task.data !== 'object' || !task.data === null) {
            element.removeAttribute('style');
            return true;
        }

        const toRemove: any[] = Object.keys(task.prev ?? {}).filter(rule => !(rule in (task.data ?? {})));

        for (const rule of toRemove) {
            if (rule.startsWith('--')) {
                element.style.setProperty(rule, null);
            } else {
                element.style[rule] = undefined;
            }
        }

        Object.keys(task.data).forEach((rule: any) =>
        {
            if (rule.startsWith('--')) {
                element.style.setProperty(rule, task.data[rule]);
            } else {
                element.style[rule] = task.data[rule];
            }
        });

        return true;
    }

}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AttributeMutator, IAttributeMutator, MutationTask } from '@/System/Interface/Attribute';

/**
 * Applies classes to the element as defined in the "class"-attribute.
 *
 * The "class" or "className" attribute can be specified with objects or strings
 * values. These are normalized to string values in the JSX element factory.
 */
@AttributeMutator(1)
export class ClassAttributeMutator implements IAttributeMutator
{
    /**
     * @inheritDoc
     */
    public mutate(task: MutationTask): boolean
    {
        if (task.name !== 'class') {
            return false;
        }

        const element: Element = task.node.isHost ? task.node.hostElement : task.node.element as Element;
        const classList: string[] = task.data?.trim().length > 0 ? task.data?.split(' ') ?? [] : [];

        element.classList.forEach((cls: string) =>
        {
            if (cls && !classList.includes(cls)) {
                element.classList.remove(cls);
            }
        });

        classList.forEach((cls: string) =>
        {
            if (cls && !element.classList.contains(cls)) {
                element.classList.add(cls);
            }
        });

        return true;
    }
}

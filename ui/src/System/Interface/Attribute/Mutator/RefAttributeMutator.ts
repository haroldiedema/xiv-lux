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
export class RefAttributeMutator implements IAttributeMutator
{
    /**
     * @inheritDoc
     */
    public mutate(task: MutationTask): boolean
    {
        if (task.name !== 'ref') {
            return false;
        }

        if (typeof task.data !== 'function') {
            throw new Error(`A "ref" attribute should provide a function.`);
        }

        const element: Element = task.node.isHost ? task.node.hostElement : task.node.element as Element;
        task.data(element);

        return true;
    }
}

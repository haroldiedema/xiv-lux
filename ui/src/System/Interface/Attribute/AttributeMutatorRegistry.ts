/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { IAttributeMutator } from '@/System/Interface/Attribute/IAttributeMutator';
import { MutationTask } from '@/System/Interface/Attribute/MutationTask';

type RegisteredMutator = {
    priority: number;
    mutator: IAttributeMutator;
};

export class AttributeMutatorRegistry
{
    private static _instance: AttributeMutatorRegistry;
    private static mutators: RegisteredMutator[] = [];

    public static getInstance(): AttributeMutatorRegistry
    {
        if (AttributeMutatorRegistry._instance === undefined) {
            AttributeMutatorRegistry._instance = new AttributeMutatorRegistry();
        }

        return AttributeMutatorRegistry._instance;
    }

    public static registerMutator(mutator: (new () => IAttributeMutator), priority: number = 0): void
    {
        this.mutators.push({ mutator: new mutator(), priority: priority });
        this.mutators.sort((a, b) =>
        {
            return a.priority < b.priority ? -1 : a.priority === b.priority ? 0 : 1;
        });
    }

    /**
     * Runs the given mutation task.
     */
    public mutate(task: MutationTask): void
    {
        for (const registration of AttributeMutatorRegistry.mutators) {
            if (true === registration.mutator.mutate(task)) {
                return;
            }
        }
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class AttributeMutatorRegistry {
    static { this.mutators = []; }
    static getInstance() {
        if (AttributeMutatorRegistry._instance === undefined) {
            AttributeMutatorRegistry._instance = new AttributeMutatorRegistry();
        }
        return AttributeMutatorRegistry._instance;
    }
    static registerMutator(mutator, priority = 0) {
        this.mutators.push({ mutator: new mutator(), priority: priority });
        this.mutators.sort((a, b) => {
            return a.priority < b.priority ? -1 : a.priority === b.priority ? 0 : 1;
        });
    }
    /**
     * Runs the given mutation task.
     */
    mutate(task) {
        for (const registration of AttributeMutatorRegistry.mutators) {
            if (true === registration.mutator.mutate(task)) {
                return;
            }
        }
    }
}
//# sourceMappingURL=AttributeMutatorRegistry.js.map
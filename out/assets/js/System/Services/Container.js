/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { Definition } from '@/System/Services/Definition';
export const Container = new class {
    constructor() {
        this.definitions = new Map();
        this.services = new Map();
        this.isLoading = [];
    }
    /**
     * Registers the given class as a service.
     *
     * Once the container has been compiled, an instance of this class can be
     * retrieved by calling `Container.get()`.
     */
    register(classDeclaration, options, ancestors, fileName) {
        this.definitions.set(classDeclaration, new Definition(classDeclaration, options.tags, options.initializer || (() => Promise.resolve()), options.dependencies || {}, options.taggedDependencies || {}, options.delegateDependencies || {}, options.sharedEventEmitters || [], ancestors, fileName));
    }
    /**
     * Returns an instance of the given class.
     *
     * If the class has not been registered, it will be registered and
     * instantiated.
     */
    get(classDeclaration) {
        if (!this.services.has(classDeclaration)) {
            throw new Error(`Service ${classDeclaration.name} is not a registered service in this context.`);
        }
        return this.services.get(classDeclaration);
    }
    /**
     * Returns a list of instances of the given classes that have been
     * tagged with the given tags.
     *
     * @param {string} tags
     * @returns {any[]}
     */
    getByTags(...tags) {
        const services = [];
        for (const def of this.definitions.values()) {
            for (const tag of tags) {
                if (def.tags.find((t) => t.name === tag)) {
                    services.push(this.get(def.classDeclaration));
                }
            }
        }
        return services;
    }
    /**
     * Returns true if the given class has been registered as a service.
     *
     * @param {ClassDeclaration} classDeclaration
     * @returns {boolean}
     */
    hasDefinition(classDeclaration) {
        return this.definitions.has(classDeclaration);
    }
    /**
     * Instantiates and caches all registered services.
     *
     * @returns {Promise<void>}
     */
    async compile() {
        for (const definition of this.definitions.values()) {
            if (false === this.services.has(definition.classDeclaration)) {
                await this.compileDefinition(definition);
            }
        }
    }
    /**
     * Instantiates the given definition and all of its dependencies.
     *
     * @param {Definition<any>} definition
     * @returns {Promise<any>}
     */
    async compileDefinition(definition) {
        if (this.services.has(definition.classDeclaration)) {
            return this.services.get(definition.classDeclaration);
        }
        // Check for circular dependencies.
        if (this.isLoading.indexOf(definition.classDeclaration) !== -1) {
            throw new Error(`Circular dependency detected for service ${definition.classDeclaration.name}.`);
        }
        this.isLoading.push(definition.classDeclaration);
        for (const ancestor of definition.ancestors) {
            if (this.definitions.has(ancestor)) {
                await this.compileDefinition(this.definitions.get(ancestor));
            }
        }
        const prototype = definition.classDeclaration.prototype;
        // Gather single dependencies.
        for (const [propertyKey, classDeclaration] of Object.entries(definition.dependencies)) {
            const dep = await this.compileDefinition(this.definitions.get(classDeclaration));
            if (!dep) {
                throw new Error(`Dependency ${classDeclaration.name} could not be resolved.`);
            }
            prototype[propertyKey] = dep;
        }
        // Gather tagged dependencies.
        for (const [propertyKey, tag] of Object.entries(definition.taggedDependencies)) {
            prototype[propertyKey] = [];
            const sortOrder = [];
            for (const def of this.definitions.values()) {
                const serviceTag = def.tags.find((t) => t.name === tag);
                if (!serviceTag) {
                    continue;
                }
                const dep = await this.compileDefinition(def);
                if (dep) {
                    prototype[propertyKey].push(dep);
                    sortOrder.push(serviceTag.priority);
                }
            }
            // Sort by priority, higher values are sorted first.
            prototype[propertyKey] = prototype[propertyKey].sort((a, b) => {
                const aIndex = sortOrder[prototype[propertyKey].indexOf(a)];
                const bIndex = sortOrder[prototype[propertyKey].indexOf(b)];
                return bIndex - aIndex;
            });
        }
        const instance = new definition.classDeclaration();
        if (typeof definition.initializer === 'function') {
            await definition.initializer(instance);
        }
        this.services.set(definition.classDeclaration, instance);
        this.isLoading.pop();
        return instance;
    }
};
//# sourceMappingURL=Container.js.map
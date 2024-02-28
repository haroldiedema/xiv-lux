/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Definition } from '@/System/Services/Definition';
import { ServiceOptions } from '@/System/Services/ServiceOptions';
import { ServiceTag } from '@/System/Services/ServiceTag';
import { ClassDeclaration } from '@/System/Types';

type DefinitionMap<T extends ClassDeclaration> = Map<T, Definition<T>>;
type ServicesMap<T extends ClassDeclaration> = Map<T, InstanceType<T>>;

export const Container = new class
{
    private readonly definitions: DefinitionMap<any> = new Map();
    private readonly services: ServicesMap<any> = new Map();
    private readonly isLoading: ClassDeclaration[] = [];

    /**
     * Registers the given class as a service.
     *
     * Once the container has been compiled, an instance of this class can be
     * retrieved by calling `Container.get()`.
     */
    public register<T extends ClassDeclaration>(
        classDeclaration: T,
        options: ServiceOptions<T>,
        ancestors: ClassDeclaration[],
        fileName: string,
    ): void
    {
        this.definitions.set(classDeclaration, new Definition(
            classDeclaration,
            options.tags as ServiceTag[],
            options.initializer || (() => Promise.resolve()),
            options.dependencies || {},
            options.taggedDependencies || {},
            options.delegateDependencies || {},
            options.sharedEventEmitters || [],
            ancestors,
            fileName,
        ));
    }

    /**
     * Returns an instance of the given class.
     *
     * If the class has not been registered, it will be registered and
     * instantiated.
     */
    public get<T extends ClassDeclaration>(classDeclaration: T): InstanceType<T>
    {
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
    public getByTags(...tags: string[]): any[]
    {
        const services: any[] = [];

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
    public hasDefinition(classDeclaration: ClassDeclaration): boolean
    {
        return this.definitions.has(classDeclaration);
    }

    /**
     * Instantiates and caches all registered services.
     *
     * @returns {Promise<void>}
     */
    public async compile(): Promise<void>
    {
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
    private async compileDefinition(definition: Definition<any>): Promise<any>
    {
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

            const sortOrder: number[] = [];

            for (const def of this.definitions.values()) {
                const serviceTag: ServiceTag = def.tags.find((t) => t.name === tag);

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
            prototype[propertyKey] = prototype[propertyKey].sort((a: any, b: any) =>
            {
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

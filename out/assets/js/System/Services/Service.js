/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { Container } from '@/System/Services/Container';
import { getDecoratedModulePath } from '@/System/Services/ModuleProvider';
/**
 * @autoload-context host,thread
 */
export function Service(options = {}) {
    return function (target) {
        registerService(target, options, getAncestors(target), getDecoratedModulePath());
    };
}
function getAncestors(target) {
    const chain = [];
    let current = target;
    let depth = 0;
    while (current) {
        depth++;
        current = Object.getPrototypeOf(current.prototype).constructor;
        if (depth > 32) {
            throw new Error('Inheritance chain too deep.');
        }
        if (current === Object) {
            break;
        }
        chain.push(current);
    }
    return chain.reverse();
}
function registerService(classDeclaration, options, ancestors, fileName) {
    options.tags = options.tags ?? [];
    options.dependencies = options.dependencies ?? {};
    options.taggedDependencies = options.taggedDependencies ?? {};
    options.delegateDependencies = options.delegateDependencies ?? {};
    options.sharedEventEmitters = options.sharedEventEmitters ?? [];
    for (let i = 0; i < options.tags.length; i++) {
        const tag = options.tags[i];
        if (typeof tag === 'string') {
            options.tags[i] = { name: tag, priority: 0 };
        }
        else {
            tag.priority = tag.priority ?? 0;
        }
    }
    const deps = Reflect.getMetadata('lux:deps:single', classDeclaration);
    if (deps) {
        options.dependencies = Object.assign(options.dependencies, deps);
    }
    const taggedDeps = Reflect.getMetadata('lux:deps:tagged', classDeclaration);
    if (taggedDeps) {
        options.taggedDependencies = Object.assign(options.taggedDependencies, taggedDeps);
    }
    const delegatedDeps = Reflect.getMetadata('lux:deps:delegate', classDeclaration);
    if (delegatedDeps) {
        options.delegateDependencies = Object.assign(options.delegateDependencies, delegatedDeps);
    }
    const sharedEvents = Reflect.getMetadata('lux:shared-events', classDeclaration);
    if (sharedEvents) {
        options.sharedEventEmitters.push(...sharedEvents);
    }
    Reflect.defineMetadata('lux:module', fileName, classDeclaration);
    Container.register(classDeclaration, options, ancestors, fileName);
}
//# sourceMappingURL=Service.js.map
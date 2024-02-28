/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import type { ServiceTag } from '@/System/Services/ServiceTag';
import type { ClassDeclaration } from '@/System/Types';

export type ServiceOptions<T extends ClassDeclaration> = {
    /**
     * A list of tags to associate with this service. Tags can be used to
     * inject a collection of services that share the same tag using the
     * "@InjectTagged" decorator.
     */
    tags?: string[] | ServiceTag[];

    /**
     * A function that will be called after the service has been instantiated.
     * This function may return a promise, in which case the service container
     * will wait for the promise to resolve before continuing the compilation
     * process.
     */
    initializer?: (service: InstanceType<T>) => any;

    /**
     * A list of dependencies that will be injected into properties of the
     * service instance. This list is automatically hydrated for properties that
     * are decorated with the {@link Inject} decorator.
     */
    dependencies?: Record<string, ClassDeclaration>;

    /**
     * A list of dependencies that will be injected into properties of the
     * service instance. This list is automatically hydrated for properties that
     * are decorated with the {@link InjectTagged} decorator.
     */
    taggedDependencies?: Record<string, string>;

    /**
     * A list of dependencies that will be injected into properties of the
     * service instance. This list is automatically hydrated for properties that
     * are decorated with the {@link Delegate} decorator.
     */
    delegateDependencies?: Record<string, string>;

    /**
     * A list of shared event emitters that will be injected into properties of
     * the service instance. This list is automatically hydrated for properties
     * that are decorated with the {@link SharedEvents} decorator.
     */
    sharedEventEmitters?: string[];

    isApplication?: boolean;
};

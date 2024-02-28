/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, ComponentConstructor } from '@/System/Interface/Component';

type Attribute = { name: string, type: any; };
type Watcher = { methodName: string, immediate: boolean; };
type WatcherCollection = Watcher[];

export class Metadata
{
    public isRendering: boolean = false;
    public dirtyProps: Set<string | symbol | number> = new Set();
    public watchers: Map<string | symbol | number, WatcherCollection> = new Map();
    public attributes: Map<string, Function> = new Map();
    public methods: Set<string> = new Set();

    constructor(Component: ComponentConstructor<AbstractComponent>)
    {
        if (typeof Component.__metadata__?.watchers !== 'undefined') {
            Object.keys(Component.__metadata__.watchers).forEach((name) =>
            {
                this.watchers.set(name, Component.__metadata__.watchers[name]);
            });
        }

        if (typeof Component.__metadata__?.attributes !== 'undefined') {
            for (const attribute of Component.__metadata__?.attributes) {
                this.attributes.set(attribute.name, attribute.type);
            }
        }

        if (typeof Component.__metadata__?.methods !== 'undefined') {
            for (const method of Component.__metadata__?.methods) {
                this.methods.add(method);
            }
        }
    }
}

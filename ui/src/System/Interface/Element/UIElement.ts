/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, ComponentConstructor } from '@/System/Interface/Component';
import { Reconciler } from '@/System/Interface/Reconciler';
import { Scheduler } from '@/System/Interface/Scheduler';
import { Container } from '@/System/Services';
import { ClassDeclaration } from '@/System/Types';
import { IWebComponent } from '@/System/Interface/Element/IWebComponent';
import { Metadata } from '@/System/Interface/Element/Metadata';

export class UIElement<T extends AbstractComponent> extends HTMLElement implements IWebComponent
{
    private readonly __taskQueue: Function[] = [];
    private readonly __metadata: Metadata;
    private readonly __reconciler: Reconciler;
    private readonly __scheduler: Scheduler;
    private readonly __component: T & {
        __service_refs__?: ({
            key: keyof T,
            kind: 'tagged' | 'singleton',
            type?: ClassDeclaration,
            tags?: string[],
        })[];
    };

    constructor(Component: ComponentConstructor<T>, private readonly __styleUrl?: string)
    {
        super();

        this.attachShadow({ mode: 'open' });

        this.__metadata = new Metadata(Component);
        this.__reconciler = new Reconciler(this as any);
        this.__scheduler = new Scheduler(this as any);
        this.__component = new Proxy(new Component(this), {
            set: this.$onPropertyChanged.bind(this),
        });

        for (const methodName of this.__metadata.methods) {
            (this as any)[methodName] = (this.$component as any)[methodName].bind(this.$component);
        }

        this.addEventListener('reactive-prop-changed', (e: CustomEvent) =>
        {
            this.$onPropertyChanged(this.$component, e.detail.key, (this.$component as any)[e.detail.key], true);
        });
    }

    /**
     * Returns the component class instance associated with this element.
     */
    public get $component(): T
    {
        return this.__component;
    }

    /**
     * @inheritDoc
     */
    public connectedCallback(): void
    {
        this.classList.add('v-dom--hidden');

        (async () =>
        {
            await this.$loadServiceRefs();
            await this.$loadStyle();
            await this.$component.onCreated();

            this.__reconciler.reconcile();
            this.__scheduler.enable();

            for (const propertyKey of this.__metadata.watchers.keys()) {
                this.__metadata.watchers.get(propertyKey).forEach(watcher =>
                {
                    if (watcher.immediate) {
                        (this.$component as any)[watcher.methodName]((this.$component as any)[propertyKey]);
                    }
                });
            }

            this.$component.onMounted();
            this.classList.remove('v-dom--hidden');
        })();
    }

    /**
     * @inheritDoc
     */
    public disconnectedCallback(): void
    {
        this.$component.onDisposed();
        this.$component.dispatch('disposed');
    }

    /**
     * @inheritDoc
     */
    public adoptedCallback(): void
    {
    }

    /**
     * @inheritDoc
     */
    public attributeChangedCallback(attributeName: string, oldValue?: string, newValue?: any): void
    {
        var type = this.__metadata.attributes.get(attributeName);
        if (!type || newValue === null || newValue === '') {
            return;
        }

        switch (type) {
            case String:
                newValue = String(newValue);
                break;
            case Number:
                newValue = Number(newValue);
                break;
            case Boolean:
                newValue = newValue === 'true' || newValue === '1' || newValue === true || newValue === 'on';
                break;
        }

        // Next frame.
        if ((this.$component as any)[attributeName] === newValue) {
            return;
        }

        (this.$component as any)[attributeName] = newValue;
    }

    public enqueueTask(task: Function): void
    {
        if (!this.__metadata.isRendering) {
            task();
            return;
        }

        this.__taskQueue.push(task);
    }

    /**
     * Proxy setter handler for properties on the component instance.
     *
     * @private
     */
    private $onPropertyChanged(target: T, propertyKey: keyof T, newValue: any, forceUpdate: boolean = false): boolean
    {
        if (!forceUpdate && target[propertyKey] === newValue) {
            return true;
        }

        const oldValue: any = target[propertyKey];
        target[propertyKey] = newValue;

        this.dispatchEvent(new CustomEvent('prop-changed', {
            detail: {
                key: propertyKey,
                oldValue: oldValue,
                newValue: newValue,
            }
        }));

        if (this.__metadata.watchers.has(propertyKey)) {
            this.__metadata.watchers.get(propertyKey).forEach(watcher =>
            {
                (this.$component as any)[watcher.methodName](newValue, oldValue);
            });
        }

        if (this.__metadata.attributes.has(propertyKey as string)) {
            (this as any)[propertyKey as any] = newValue;
        }

        if (propertyKey.toString().startsWith('_')) {
            return true;
        }

        if (this.__metadata.isRendering) {
            if (this.__metadata.dirtyProps.has(propertyKey) && oldValue !== newValue) {
                console.warn([
                    `Property "${target.constructor.name}.${propertyKey.toString()}" has changed during render.`,
                    `This can cause infinite loops and other state-related bugs.`,
                    `The value changed from [`, oldValue, '] to [', newValue, '].',
                ].join(' '));
            }

            return true;
        }

        this.__metadata.dirtyProps.add(propertyKey);

        this.__scheduler.scheduleUpdate(() =>
        {
            this.__metadata.isRendering = true;
            this.__reconciler.reconcile();
            this.__metadata.isRendering = false;
            this.__metadata.dirtyProps.clear();

            while (this.__taskQueue.length > 0) {
                this.__taskQueue.shift()();
            }
        });

        return true;
    }

    /**
     * Injects all service references used by the UI component.
     *
     * @private
     */
    private async $loadServiceRefs(): Promise<void>
    {
        if (typeof this.__component['__service_refs__'] === 'undefined') {
            return;
        }

        for (const ref of this.__component['__service_refs__']) {
            switch (ref.kind) {
                case 'tagged':
                    (this.__component as any)[ref.key] = Container.getByTags(...ref.tags);
                    break;
                case 'singleton':
                    this.__component[ref.key] = Container.get(ref.type);
                    break;
            }
        }
    }

    /**
     * Loads the given style URL.
     *
     * @private
     */
    private async $loadStyle(): Promise<void>
    {
        if (!this.__styleUrl) {
            return;
        }

        await this.$loadStylesheetFromPath(this.__styleUrl);
    }

    /**
     * Loads a stylesheet from the given path.
     *
     * @private
     */
    private async $loadStylesheetFromPath(path: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('media', 'screen');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', '/' + (path.replace(/^\//, '')));
            link.onload = () =>
            {
                this.classList.remove('v-dom--hidden');
                resolve();
            };

            link.onerror = () =>
            {
                reject(`Failed to load UIComponent style "${this.__styleUrl}".`);
            };

            this.shadowRoot.appendChild(link);
        });
    }
}

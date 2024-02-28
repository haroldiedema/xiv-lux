/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AppletManagerEvents } from "@/System/Applet/AppletManagerEvents";
import { AppletRepository } from "@/System/Applet/AppletRepository";
import { EventEmitter } from "@/System/Event";
import { Service } from "@/System/Services";

@Service()
export class AppletManager extends EventEmitter<AppletManagerEvents>
{
    private readonly instances: Map<string, HTMLElement> = new Map();

    private observer: MutationObserver | null = null;
    private containerElement: HTMLElement | null = null;

    public initialize(container: HTMLElement): void
    {
        if (this.containerElement !== null) {
            throw new Error('AppletManager has already been initialized.');
        }

        this.containerElement = container;
        this.observer = new MutationObserver(this.onContainerMutation.bind(this));
        this.observer.observe(container, { childList: true, subtree: false });

        const state = JSON.parse(localStorage.getItem('applet-state') ?? 'null');
        if (!state) return;

        setTimeout(() => Object.keys(state).forEach((tagName) =>
        {
            if (AppletRepository.has(tagName) !== false) {
                this.spawn(tagName);
            }
        }), 500);
    }

    public dispose(): void
    {
        if (this.observer !== null) {
            this.observer.disconnect();
            this.observer = null;
        }

        this.containerElement = null;
    }

    public isOpen(name: string): boolean
    {
        if (false == AppletRepository.has(name)) {
            throw new Error(`Applet with name '${name}' does not exist.`);
        }

        const applet = AppletRepository.get(name);
        const identifier = this.getAppletIdentifier(name, applet.options.isSingleInstance, 0);

        return this.instances.has(identifier);
    }

    public async spawn<T extends HTMLElement>(name: string, argument: any = null): Promise<T>
    {
        if (null == this.containerElement) {
            throw new Error('AppletManager has not been initialized.');
        }

        if (false == AppletRepository.has(name)) {
            throw new Error(`Applet with name '${name}' does not exist.`);
        }

        const applet = AppletRepository.get(name);
        const identifier = this.getAppletIdentifier(name, applet.options.isSingleInstance);

        if (applet.options.isSingleInstance && this.instances.has(identifier)) {
            return this.instances.get(identifier) as T;
        }

        const appletWindow = document.createElement('lux-applet-window');
        const state = this.getAppletState(applet.tagName);

        appletWindow.setAttribute('identifier', identifier);
        appletWindow.setAttribute('component', name);
        appletWindow.setAttribute('argument', JSON.stringify(argument));
        appletWindow.setAttribute('state', JSON.stringify(state));

        appletWindow.addEventListener('state-changed', (e: CustomEvent) =>
        {
            localStorage.setItem('applet-state-' + applet.tagName, JSON.stringify(e.detail));
        });

        this.containerElement.appendChild(appletWindow);
        this.dispatch('applet-opened', identifier);
    }

    public toggle(name: string): void
    {
        if (null == this.containerElement) {
            throw new Error('AppletManager has not been initialized.');
        }

        if (false == AppletRepository.has(name)) {
            throw new Error(`Applet with name '${name}' does not exist.`);
        }

        const applet = AppletRepository.get(name);
        const identifier = this.getAppletIdentifier(name, applet.options.isSingleInstance);

        if (applet.options.isSingleInstance && this.instances.has(identifier)) {
            this.instances.get(identifier).remove();
        } else {
            this.spawn(name);
        }
    }

    private getAppletState(tagName: string): any
    {
        if (localStorage.getItem('applet-state-' + tagName)) {
            return JSON.parse(localStorage.getItem('applet-state-' + tagName));
        }

        const options = AppletRepository.get(tagName).options;

        return {
            x: window.innerWidth / 2 - options.minWidth / 2,
            y: window.innerHeight / 2 - options.minHeight / 2,
            width: options.minWidth,
            height: options.minHeight,
        };
    }

    /**
     * Invoked when mutations are detected on the container element.
     */
    private onContainerMutation(mutations: MutationRecord[]): void
    {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement && node.tagName.toLowerCase() === 'lux-applet-window') {
                    this.onAppletWindowAdded(node);
                }
            }
            for (const node of mutation.removedNodes) {
                if (node instanceof HTMLElement && node.tagName.toLowerCase() === 'lux-applet-window') {
                    this.onAppletWindowRemoved(node);
                }
            }
        }
    }

    private onAppletWindowAdded(node: HTMLElement): void
    {
        const identifier = node.getAttribute('identifier');
        const component = node.getAttribute('component');

        if (identifier === null || component === null) {
            throw new Error('Invalid applet window element.');
        }

        this.instances.set(identifier, node);
        this.storeState();
    }

    private onAppletWindowRemoved(node: HTMLElement): void
    {
        const identifier = node.getAttribute('identifier');

        if (identifier === null) {
            throw new Error('Invalid applet window element.');
        }

        this.instances.delete(identifier);
        this.dispatch('applet-closed', identifier);
        this.storeState();
    }

    /**
     * Returns an identifier for the applet based on the applet name and
     * whether or not the applet is a single instance.
     */
    private getAppletIdentifier(name: string, isSingleInstance: boolean, offset: number = 1)
    {
        if (isSingleInstance) {
            return name;
        }

        let highestInstanceId: number = 0;

        for (var k in this.instances.keys()) {
            if (k.startsWith(name + ':')) {
                const instanceId = parseInt(k.split(':')[1]);

                if (instanceId > highestInstanceId) {
                    highestInstanceId = instanceId;
                }
            }
        }

        return name + ':' + (highestInstanceId + offset);
    }

    private storeState(): void
    {
        const state = {};

        for (const [identifier, node] of this.instances) {
            const tagName = identifier.split(':')[0];

            if (AppletRepository.has(tagName) && AppletRepository.get(tagName).options.isSingleInstance) {
                state[tagName] = true;
            }
        }

        localStorage.setItem('applet-state', JSON.stringify(state));
    }
}
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventSubscriber } from '@/System/Event/EventSubscriber';

export class EventEmitter<T extends { [eventName: string]: any; }>
{
    private readonly subscriptions: Map<keyof T, Set<EventSubscriber<any>>> = new Map();

    public dispatch<E extends keyof T>(name: E, args?: T[E]): void
    {
        if (false === this.subscriptions.has(name)) {
            return;
        }

        this.subscriptions.get(name).forEach(subscriber =>
        {
            subscriber.invoke(args);
        });
    }

    /**
     * Invokes the given callback whenever an event with the given name has been
     * dispatched by the system.
     */
    public on<E extends keyof T>(name: E, callback: (args?: T[E]) => any): EventSubscriber<T[E]>
    {
        return this.createSubscriberOf(name, callback, false);
    }

    /**
     * Invokes the given callback only once for the given event.
     */
    public once<E extends keyof T>(name: E, callback: (args?: T[E]) => any): EventSubscriber<T[E]>
    {
        return this.createSubscriberOf(name, callback, true);
    }

    /**
     * Unsubscribes the given event subscriber to no longer receive event data.
     *
     * @param {EventSubscriber<any>} subscription
     */
    public unsubscribe(subscription: EventSubscriber<any>): void
    {
        if (false === this.subscriptions.has(subscription.name)) {
            return;
        }

        const subscribers = this.subscriptions.get(subscription.name);

        subscribers.delete(subscription);

        if (subscribers.size === 0) {
            this.subscriptions.delete(subscription.name);
        }
    }

    /**
     * Creates and registers an {@link EventSubscriber} object.
     *
     * @private
     */
    private createSubscriberOf<E extends keyof T>(name: E, callback: (args?: T[E]) => any, isOnce: boolean)
    {
        const subscriber = new EventSubscriber(this, name as string, (args: T[E]) =>
        {
            callback(args);

            if (isOnce) {
                this.unsubscribe(subscriber);
            }
        });

        if (false === this.subscriptions.has(name)) {
            this.subscriptions.set(name, new Set());
        }

        this.subscriptions.get(name).add(subscriber);

        return subscriber;
    }
}

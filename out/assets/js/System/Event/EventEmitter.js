/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { EventSubscriber } from '@/System/Event/EventSubscriber';
export class EventEmitter {
    constructor() {
        this.subscriptions = new Map();
    }
    dispatch(name, args) {
        if (false === this.subscriptions.has(name)) {
            return;
        }
        this.subscriptions.get(name).forEach(subscriber => {
            subscriber.invoke(args);
        });
    }
    /**
     * Invokes the given callback whenever an event with the given name has been
     * dispatched by the system.
     */
    on(name, callback) {
        return this.createSubscriberOf(name, callback, false);
    }
    /**
     * Invokes the given callback only once for the given event.
     */
    once(name, callback) {
        return this.createSubscriberOf(name, callback, true);
    }
    /**
     * Unsubscribes the given event subscriber to no longer receive event data.
     *
     * @param {EventSubscriber<any>} subscription
     */
    unsubscribe(subscription) {
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
    createSubscriberOf(name, callback, isOnce) {
        const subscriber = new EventSubscriber(this, name, (args) => {
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
//# sourceMappingURL=EventEmitter.js.map
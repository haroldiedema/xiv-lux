/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent } from '@/System/Interface';

type Callback<T extends object> = (modifiedObject: T, key: string, newValue: any, oldValue: any) => void;

const _proxyReferenceMap: WeakMap<object, object> = new WeakMap();

export function Reactive<T extends AbstractComponent>(target: T, propertyKey: string): void
{
    let value: any = target[propertyKey as keyof T];
    let watcher: any = null;

    Object.defineProperty(target, propertyKey, {
        get()
        {
            return watcher;
        },
        set(newValue)
        {
            if (newValue === watcher || newValue === value) {
                return;
            }

            value = newValue;
            watcher = watchObject(newValue, (modifiedObject, key, newValue, oldValue) =>
            {
                this.$host.dispatchEvent(new CustomEvent('reactive-prop-changed', {
                    detail: {
                        key: propertyKey,
                    },
                }));
            });
        },
    });
}

function watchObject(obj: object, callback: Callback<object>): ProxyHandler<object>
{
    if (_proxyReferenceMap.has(obj)) {
        return _proxyReferenceMap.get(obj);
    }

    const proxy = new Proxy(obj, {
        get(target, key, receiver)
        {
            const value = Reflect.get(target, key, receiver);
            if (typeof value === 'object' && value !== null) {
                return watchObject(value, callback);
            }
            return value;
        },
        set(target, key, newValue, receiver)
        {
            const oldValue = Reflect.get(target, key, receiver);
            if (oldValue !== newValue) {
                callback(receiver, key as string, newValue, oldValue);
            }
            return Reflect.set(target, key, newValue, receiver);
        },
    });

    _proxyReferenceMap.set(obj, proxy);

    return proxy;
}

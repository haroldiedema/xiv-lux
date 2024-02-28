/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
const _proxyReferenceMap = new WeakMap();
export function Reactive(target, propertyKey) {
    let value = target[propertyKey];
    let watcher = null;
    Object.defineProperty(target, propertyKey, {
        get() {
            return watcher;
        },
        set(newValue) {
            if (newValue === watcher || newValue === value) {
                return;
            }
            value = newValue;
            watcher = watchObject(newValue, (modifiedObject, key, newValue, oldValue) => {
                this.$host.dispatchEvent(new CustomEvent('reactive-prop-changed', {
                    detail: {
                        key: propertyKey,
                    },
                }));
            });
        },
    });
}
function watchObject(obj, callback) {
    if (_proxyReferenceMap.has(obj)) {
        return _proxyReferenceMap.get(obj);
    }
    const proxy = new Proxy(obj, {
        get(target, key, receiver) {
            const value = Reflect.get(target, key, receiver);
            if (typeof value === 'object' && value !== null) {
                return watchObject(value, callback);
            }
            return value;
        },
        set(target, key, newValue, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            if (oldValue !== newValue) {
                callback(receiver, key, newValue, oldValue);
            }
            return Reflect.set(target, key, newValue, receiver);
        },
    });
    _proxyReferenceMap.set(obj, proxy);
    return proxy;
}
//# sourceMappingURL=Reactive.js.map
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AttributeMutator, MutationType } from '@/System/Interface/Attribute';
/**
 * Applies any attributes that aren't picked up by other mutators.
 */
let EventAttributeMutator = class EventAttributeMutator {
    /**
     * @inheritDoc
     */
    mutate(task) {
        if (false === task.name.startsWith('on:')) {
            return false;
        }
        task.node.meta.events = (task.node.meta.events ?? {});
        const isFlow = task.name.charAt(3) === '$';
        const eventName = task.name.substr(isFlow ? 4 : 3);
        const element = task.node.isHost ? task.node.hostElement : task.node.element;
        switch (task.type) {
            case MutationType.UPDATE:
                if (task.node.meta.events[eventName]) {
                    element.removeEventListener(eventName, task.node.meta.events[eventName]);
                }
            // Fall-through.
            case MutationType.CREATE:
                const listener = (e) => {
                    if (!isFlow) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    task.data(e);
                };
                task.node.meta.events[eventName] = listener;
                element.addEventListener(eventName, listener, { passive: false });
                break;
            case MutationType.REMOVE:
                if (task.node.meta.events[eventName]) {
                    element.removeEventListener(eventName, task.node.meta.events[eventName]);
                }
                break;
        }
        return true;
    }
};
EventAttributeMutator = __decorate([
    AttributeMutator(10)
], EventAttributeMutator);
export { EventAttributeMutator };
//# sourceMappingURL=EventAttributeMutator.js.map
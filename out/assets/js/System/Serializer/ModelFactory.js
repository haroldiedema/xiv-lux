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
var ModelFactory_1;
import { Service } from "@/System/Services";
let ModelFactory = class ModelFactory {
    static { ModelFactory_1 = this; }
    static { this.repository = new Map(); }
    static { this.overrides = new Map(); }
    /**
     * Deserialize any known models in-place inside the payload.
     */
    deserialize(payload) {
        if (typeof payload !== 'object' || payload === null) {
            return payload;
        }
        if (Array.isArray(payload)) {
            for (let i = 0; i < payload.length; i++) {
                payload[i] = this.deserialize(payload[i]);
            }
            return payload;
        }
        for (const [key, value] of Object.entries(payload)) {
            payload[key] = this.deserialize(value);
        }
        if (typeof payload['_k'] === 'string' && Array.isArray(payload['_d'])) {
            payload = this.make(payload['_k'], this.deserialize(payload['_d']));
        }
        return payload;
    }
    make(kind, data) {
        const model = ModelFactory_1.repository.get(kind);
        const ctor = ModelFactory_1.overrides.get(kind) || (model ? model.ctor : undefined);
        if (model === undefined || ctor === undefined) {
            console.warn(`Unknown model kind: ${kind}. Data is left as-is in the response.`);
            return data;
        }
        const instance = new ctor();
        model.keys.forEach((key) => {
            instance[key.name] = key.transform ? key.transform(data[key.offset]) : data[key.offset];
        });
        if (typeof instance['__init__'] === 'function') {
            instance['__init__']();
        }
        return instance;
    }
};
ModelFactory = ModelFactory_1 = __decorate([
    Service()
], ModelFactory);
export { ModelFactory };
//# sourceMappingURL=ModelFactory.js.map
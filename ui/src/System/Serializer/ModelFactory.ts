/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ModelMetadata } from "@/System/Serializer/Metadata";
import { Service } from "@/System/Services";

@Service()
export class ModelFactory
{
    public static repository: Map<string, ModelMetadata> = new Map();
    public static overrides: Map<string, new () => any> = new Map();

    /**
     * Deserialize any known models in-place inside the payload.
     */
    public deserialize(payload: any): any
    {
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

    public make(kind: string, data: any[]): any
    {
        const model = ModelFactory.repository.get(kind);
        const ctor = ModelFactory.overrides.get(kind) || (model ? model.ctor : undefined);

        if (model === undefined || ctor === undefined) {
            console.warn(`Unknown model kind: ${kind}. Data is left as-is in the response.`);
            return data;
        }

        const instance = new ctor();

        model.keys.forEach((key) =>
        {
            instance[key.name] = key.transform ? key.transform(data[key.offset]) : data[key.offset];
        });

        if (typeof instance['__init__'] === 'function') {
            instance['__init__']();
        }

        return instance;
    }
}

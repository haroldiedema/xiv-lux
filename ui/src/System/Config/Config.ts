/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ConfigVariableName, ConfigVariableType, ConfigVariables } from "@/System/Config/ConfigVariables";
import { EventEmitter } from "@/System/Event";
import { Service } from "@/System/Services";
import { Timeout } from "@/System/Types";

type ConfigEvents = { [K in ConfigVariableName]: ConfigVariableType<K> };

@Service()
export class Config extends EventEmitter<ConfigEvents>
{
    private readonly data: Record<ConfigVariableName, any>;
    private writeDebounce: Timeout = null;

    constructor()
    {
        super();

        const userVarsData = typeof localStorage.getItem('lux-config') === 'string'
            ? JSON.parse(localStorage.getItem('lux-config')) as Record<ConfigVariableName, any>
            : {};

        this.data = {} as any;
        Object.keys(ConfigVariables).forEach((name) => this.data[name] = userVarsData[name] ?? ConfigVariables[name].default);

        (window as any).config = this;
    }

    public get<K extends ConfigVariableName, T extends ConfigVariableType<K>>(id: K): T
    {
        return this.data[id];
    }

    public set<K extends ConfigVariableName, T extends ConfigVariableType<K>>(id: K, value: T)
    {
        if (this.data[id] === value) {
            return;
        }

        this.data[id] = value;
        this.dispatch(id, value as any);
        this.scheduleWrite();
    }

    private scheduleWrite(): void
    {
        clearTimeout(this.writeDebounce);
        this.writeDebounce = setTimeout(() => localStorage.setItem('lux-config', JSON.stringify(this.data)));
    }
}

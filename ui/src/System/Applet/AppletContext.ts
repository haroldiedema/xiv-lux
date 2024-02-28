/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AppletOptions } from "@/System/Applet/Applet";
import { EventEmitter } from "@/System/Event";

type AppletConfigEvents = {
    'name': string;
    'description': string;
    'isFrameless': boolean;
};

export class AppletConfig extends EventEmitter<AppletConfigEvents>
{
    private _name: string = '';
    private _description: string = '';
    private _isFrameless: boolean = false;

    constructor(options: AppletOptions, public readonly argument: any)
    {
        super();

        this._name = options.name;
        this._description = options.description;
        this._isFrameless = options.isFrameless;
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(value: string)
    {
        this._name = value;
        this.dispatch('name', value);
    }

    public get description(): string
    {
        return this._description;
    }

    public set description(value: string)
    {
        this._description = value;
        this.dispatch('description', value);
    }

    public get isFrameless(): boolean
    {
        return this._isFrameless;
    }

    public set isFrameless(value: boolean)
    {
        this._isFrameless = value;
        this.dispatch('isFrameless', value);
    }
}

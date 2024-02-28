/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AppletOptions } from "@/System/Applet/Applet";

export const AppletRepository = new class
{
    private applets: Map<string, RegisteredApplet> = new Map();

    public register(name: string, options: AppletOptions)
    {
        this.applets.set(name, { tagName: name, options: options });
    }

    public get(name: string)
    {
        return this.applets.get(name);
    }

    public has(name: string)
    {
        return this.applets.has(name);
    }

    public get names()
    {
        return Array.from(this.applets.keys());
    }

    public get singletonNames()
    {
        return this.names.filter(name => this.applets.get(name).options.isSingleInstance);
    }
};

type RegisteredApplet = {
    tagName: string;
    options: AppletOptions;
};

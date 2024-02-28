/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractApplet } from "@/System/Applet/AbstractApplet";
import { AppletRepository } from "@/System/Applet/AppletRepository";
import { UIComponent } from "@/System/Interface";
import { ComponentConstructor } from "@/System/Interface/Component";

/**
 * @autoload
 */
export function Applet(name: string, options: AppletOptions = {})
{
    return function (target: ComponentConstructor<AbstractApplet>)
    {
        UIComponent(name, options.styleUrl)(target);

        AppletRepository.register(name, Object.assign({
            windowTitle: name,
            minWidth: 512,
            minHeight: 256,
            isSingleInstance: false,
            isFrameless: false
        }, options));
    };
}

export type AppletOptions = {
    styleUrl?: string;
    name?: string;
    description?: string;
    icon?: string;
    minWidth?: number;
    minHeight?: number;
    isSingleInstance?: boolean;
    isFrameless?: boolean;
};

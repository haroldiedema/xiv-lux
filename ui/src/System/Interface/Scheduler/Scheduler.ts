/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, UIElement } from '@/System/Interface';

export class Scheduler
{
    private isEnabled: boolean = false;
    private updateRef: ReturnType<typeof setTimeout> = null;

    constructor(private readonly element: UIElement<AbstractComponent>)
    {
    }

    public enable(): void
    {
        this.isEnabled = true;
    }

    public scheduleUpdate(callback: () => any): void
    {
        if (false === this.isEnabled || null !== this.updateRef) {
            return;
        }

        this.updateRef = setTimeout(() =>
        {
            this.updateRef = null;
            callback();
        }, 0);
    }
}

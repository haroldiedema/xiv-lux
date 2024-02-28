/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, UIComponent } from "@/System/Interface";
import { Interval } from "@/System/Types";

@UIComponent("lux-toolbar-clock", "/css/toolbar/lux-toolbar-clock.css")
export class LuxToolbarClock extends AbstractComponent
{
    private localTime: string = '00:00';
    private eoreaTime: string = '00:00';
    private timer?: Interval = null;

    /**
     * @inheritdoc
     */
    public override onMounted(): void
    {
        this.timer = setInterval(() =>
        {
            const eTime = new Date(Date.now() * 20.571428571428573);
            const lTime = new Date();

            this.eoreaTime = this.dateToString(eTime, true);
            this.localTime = this.dateToString(lTime, false);
        }, 500);
    }

    /**
     * @inheritdoc
     */
    public onDisposed(): void
    {
        this.timer && clearInterval(this.timer);
    }

    /**
     * @inheritdoc
     */
    public render()
    {
        return (
            <ui:host>
                <div class="clock">
                    <label>ET</label>
                    <div>{this.eoreaTime}</div>
                </div>
                <div class="clock">
                    <label>LT</label>
                    <div>{this.localTime}</div>
                </div>
            </ui:host>
        );
    }

    /**
     * Converts a date to a string.
     */
    private dateToString(date: Date, useUTC: boolean = false): string
    {
        return [
            `0${useUTC ? date.getUTCHours() : date.getHours()}`.slice(-2),
            `0${useUTC ? date.getUTCMinutes() : date.getMinutes()}`.slice(-2),
        ].join(':');
    }
}
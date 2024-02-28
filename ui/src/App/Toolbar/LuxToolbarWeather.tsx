/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { WeatherForecast, Zone } from "@/XIV/Models/Generated";

@UIComponent("lux-toolbar-weather", "/css/toolbar/lux-toolbar-weather.css")
export class LuxToolbarWeather extends AbstractComponent
{
    @Inject private readonly socket: Socket;
    @Inject private readonly invoker: Invoker;

    private forecast: WeatherForecast[] = [];
    private currentZone: Zone = null;
    private showPanel: boolean = false;

    /**
     * @inheritdoc
     */
    public override async onMounted(): Promise<void>
    {
        this.socket.subscribe(this, 'CurrentWeatherForecast', fc => this.forecast = fc);
        this.socket.subscribe(this, 'CurrentZone', zone => this.currentZone = zone);
    }

    /**
     * @inheritdoc
     */
    public override onDisposed(): void
    {
    }

    /**
     * @inheritdoc
     */
    public render()
    {
        if (this.forecast.length === 0 || !this.currentZone) {
            return <ui:host/>;
        }

        return (
            <ui:host
                on:$mousedown={() => this.showPanel = true}
                on:$mouseleave={() => this.showPanel = false}
            >
                <div class="name">
                    <div>{this.forecast[0].name}</div>
                    <div>{this.forecast[1]?.time.replace(/^(In )/g, '') ?? 'Everlasting'}</div>
                </div>
                <div class="icon"><xiv-icon icon={this.forecast[0].iconId} size={20}/></div>
                <lux-panel anchor={this.$host} hidden={!this.showPanel}>
                    {this.renderForcastPanel()}
                </lux-panel>
            </ui:host>
        )
    }

    private renderForcastPanel()
    {
        let lastName = '';
        return (
            <table>
                <tbody>
                    <tr>
                        <th colspan={2} class="header">
                            <h3>Weather forecast in</h3>
                            <div>{this.currentZone.placeName}</div>
                        </th>
                    </tr>
                    {this.forecast.slice(1).map((f, i) => {
                        if (f.name === lastName) {
                            return null;
                        }
                        lastName = f.name;

                        return (
                            <tr key={i}>
                                <td class="fc-icon"><xiv-icon icon={f.iconId} size={32}/></td>
                                <td class="fc-name" valign="middle">
                                    {f.name}
                                    <div>{f.time}</div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

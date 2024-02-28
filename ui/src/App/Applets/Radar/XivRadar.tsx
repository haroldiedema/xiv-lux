/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { RadarRenderer } from "@/App/Applets/Radar/RadarRenderer";
import { AbstractApplet, Applet } from "@/System/Applet";
import { Inject } from "@/System/Interface";
import { Socket } from "@/System/Socket";

@Applet('xiv-radar', {
    name            : 'Radar',
    styleUrl        : '/css/applets/xiv-radar.css',
    icon            : 'radar',
    isFrameless     : true,
    isSingleInstance: true,
    minWidth        : 128,
    minHeight       : 128,
})
export class XivRadar extends AbstractApplet
{
    @Inject private readonly socket: Socket;

    private renderer: RadarRenderer;


    /**
     * @inheritdoc
     */
    public override onMounted(): void
    {
        this.renderer = new RadarRenderer(this.$host.shadowRoot.querySelector('canvas'), this.socket);
    }

    /**
     * @inheritdoc
     */
    public override onDisposed(): void
    {
        this.renderer.dispose();
    }

    /**
     * @inheritdoc
     */
    public override render()
    {
        return (
            <ui:host>
                <canvas/>
            </ui:host>
        );
    }
}
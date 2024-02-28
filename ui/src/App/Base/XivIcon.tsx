/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Attribute, Inject, UIComponent } from "@/System/Interface";
import { Socket } from "@/System/Socket";

@UIComponent('xiv-icon', '/css/base/xiv-icon.css')
export class XivIcon extends AbstractComponent
{
    @Attribute icon: number = 0;
    @Attribute size: number = null;
    @Attribute filter: string = null;

    @Inject private readonly socket: Socket;

    public render()
    {
        return (
            <ui:host style={{
                '--width': this.size ? `${this.size}px` : 'auto',
                '--height': this.size ? `${this.size}px` : 'auto',
                '--filter': this.filter
            }}>
                <img src={`${this.socket.httpAddress}/image/icon/${this.icon}.png`}/>
            </ui:host>
        );
    }
}

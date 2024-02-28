/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Attribute, UIComponent } from "@/System/Interface";

@UIComponent('xiv-world-map-toolbar-button', '/css/applets/xiv-world-map-toolbar-button.css')
export class WorldMapToolbarButton extends AbstractComponent
{
    @Attribute public label: string = '';
    @Attribute public tooltip: string = '';
    @Attribute public icon: string = 'checkmark';
    @Attribute public icon2: string = '';
    @Attribute public disabled: boolean = false;
    @Attribute public color: string = null;

    public render()
    {
        return (
            <ui:host class={{disabled: this.disabled}}>
                <main>
                    {this.renderIcon(this.icon)}
                    {this.icon2 && <div>{this.renderIcon(this.icon2, 22)}</div>}
                </main>
                <div class="tooltip">{this.tooltip}</div>
            </ui:host>
        )
    }

    private renderIcon(icon: string, size: number = 32, color: string = null)
    {
        if (! isNaN(parseInt(icon))) {
            return <xiv-icon icon={icon} size={size}/>
        }

        return <fa-icon name={icon} type="duotone" size={size - 12} color={this.color || '#fff'}/>;
    }
}

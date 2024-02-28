/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AppletRepository } from "@/System/Applet";
import { Config } from "@/System/Config";
import { AbstractComponent, Attribute, Inject, UIComponent } from "@/System/Interface";
import { Socket } from "@/System/Socket";

@UIComponent('lux-toolbar', '/css/toolbar/lux-toolbar.css')
export class LuxToolbar extends AbstractComponent
{
    @Attribute public position: string;

    @Inject private readonly config: Config;
    @Inject private readonly socket: Socket;

    private isAutoHideEnabled: boolean = false;
    private isMouseOver: boolean = false;
    private isUsingNativeElements: boolean = false;

    public onMounted(): void
    {
        this.isAutoHideEnabled = this.config.get('toolbar.autoHide');

        this.config.on('toolbar.autoHide', (value) => this.isAutoHideEnabled = value);
        this.socket.subscribe('VisibleNativeElements', e => this.isUsingNativeElements = e.length > 0);
    }

    public render()
    {
        return (
            <ui:host 
                class={{
                    bottom: this.position === 'bottom', 
                    top: this.position === 'top',
                    autoHide: this.isAutoHideEnabled,
                    isMouseOver: this.isMouseOver,
                }}
                on:$mouseenter={() => this.isMouseOver = true}
                on:$mouseout={() => this.isMouseOver = false}
            >
                <main>
                    <div id="background"/>
                    <section></section>
                    <section></section>
                    <section class={{'is-using-native-elements': this.isUsingNativeElements}}>
                        {AppletRepository.singletonNames.map((name: string) => (
                            <lux-toolbar-app app={name}/>
                        ))}
                        <vr/>
                        <lux-toolbar-location/>
                        <lux-toolbar-weather/>
                        <lux-toolbar-clock/>
                        <vr/>
                        {this.renderAutoHideButton()}
                        {this.renderPositionButton()}
                    </section>
                </main>
            </ui:host>
        )
    }

    /**
     * Renders the button to toggle the auto-hide feature.
     */
    private renderAutoHideButton()
    {
        return (
            <button 
                class="ghost icon"
                on:click={() => this.config.set('toolbar.autoHide', !this.isAutoHideEnabled)}
            >
                <fa-icon 
                    name={'thumbtack'}
                    type="duotone"
                    size={14}
                    color={this.isAutoHideEnabled ? '#a09fa0' : '#fff'}
                    rotate={this.isAutoHideEnabled ? '45deg' : '0deg'}
                    invert
                />
            </button>
        );
    }

    /**
     * Renders the button to toggle the toolbar position.
     */
    private renderPositionButton()
    {
        return (
            <button 
                class="ghost icon" 
                on:click={() => this.config.set('toolbar.position', this.config.get('toolbar.position') === 'bottom' ? 'top' : 'bottom')}
            >
                <fa-icon 
                    name={this.position === 'bottom' ? 'border-bottom' : 'border-top'}
                    type="duotone"
                    color="#ffa"
                    color2="#c0bfc0"
                    invert
                />
            </button>
        );
    }
}
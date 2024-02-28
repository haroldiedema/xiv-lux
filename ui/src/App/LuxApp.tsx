/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AppletManager } from "@/System/Applet";
import { Config } from "@/System/Config";
import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { GameState } from "@/XIV/GameState";

@UIComponent('lux-app', '/css/base/lux-app.css')
export class LuxApp extends AbstractComponent
{
    @Inject private readonly config: Config;
    @Inject private readonly socket: Socket;
    @Inject private readonly invoker: Invoker;
    @Inject private readonly appletManager: AppletManager;

    @Inject private readonly gameState: GameState;

    private containerElement: HTMLElement = null;
    private isToolbarTop: boolean = false;
    private isLoggedIn: boolean = false;
    private nativeElementsVisible: boolean = false;

    public onMounted(): void
    {
        (window as any).i = this.invoker;

        this.gameState.on('login', () => this.onLogin());
        this.gameState.on('logout', () => this.onLogout());

        this.config.on('toolbar.position', (value) => this.isToolbarTop = value === 'top');
        this.config.get('toolbar.position') === 'top';

        this.socket.subscribe('VisibleNativeElements', e => {
            this.nativeElementsVisible = e.length > 0;
            console.log(e);
        });

        this.isToolbarTop = this.config.get('toolbar.position') === 'top';

        if (this.gameState.isLoggedIn) {
            this.onLogin();
        }
    }

    public render()
    {
        if (!this.isLoggedIn) {
            return (
                <ui:host/>
            );
        }

        return (
            <ui:host>
                <main 
                    ref={(el: HTMLElement) => this.containerElement = el}
                    style={{top: this.isToolbarTop ? '32px' : '0px'}}
                    class={{hidden: this.nativeElementsVisible}}
                />
                <aside
                    style={{
                        top: this.isToolbarTop ? '0px' : 'unset',
                        bottom: this.isToolbarTop ? 'unset' : '0px',
                    }}
                >
                <lux-toolbar position={this.isToolbarTop ? 'top' : 'bottom'}/>
                </aside>
            </ui:host>
        );
    }

    private onLogin(): void
    {
        this.isLoggedIn = true;

        this.enqueueDeferredTask(() => {
            this.appletManager.initialize(this.containerElement);
        });
    }

    private onLogout(): void
    {
        this.isLoggedIn = false;
        this.appletManager.dispose();
    }
}

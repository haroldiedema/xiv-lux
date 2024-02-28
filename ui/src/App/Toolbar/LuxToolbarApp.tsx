/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AppletManager, AppletRepository } from "@/System/Applet";
import { EventSubscriber } from "@/System/Event";
import { AbstractComponent, Attribute, UIComponent } from "@/System/Interface";
import { Inject } from "@/System/Interface";

@UIComponent("lux-toolbar-app", "/css/toolbar/lux-toolbar-app.css")
export class LuxToolbarApp extends AbstractComponent
{
    @Attribute public app: string;

    @Inject private readonly appletManager: AppletManager;

    private openedListener: EventSubscriber<string>;
    private closedListener: EventSubscriber<string>;

    private name: string = '';
    private icon: string = '';
    private isOpen: boolean = false;

    /**
     * @inheritdoc
     */
    public override onCreated()
    {
        const options = AppletRepository.get(this.app).options;
        this.isOpen = this.appletManager.isOpen(this.app);

        this.name = options.name;
        this.icon = options.icon;

        this.openedListener = this.appletManager.on('applet-opened', (app) => {
            if (app === this.app) {
                this.isOpen = true;
            }
        });

        this.closedListener = this.appletManager.on('applet-closed', (app) => {
            if (app === this.app) {
                this.isOpen = false;
            }
        });
    }

    /**
     * @inheritdoc
     */
    public override onDisposed(): void
    {
        this.openedListener.unsubscribe();
        this.closedListener.unsubscribe();
    }

    /**
     * @inheritdoc
     */
    public render()
    {
        return (
            <ui:host>
                <main on:click={() => this.toggleApplet()} class={{active: this.isOpen}}>
                    {this.renderIcon()}
                    <div class="name">{this.name}</div>
                </main>
            </ui:host>
        );
    }

    private toggleApplet(): void
    {
        this.appletManager.toggle(this.app);
    }

    private renderIcon()
    {
        if (! this.icon) {
            return null;
        }

        if (!isNaN(parseInt(this.icon))) {
            return (
                <div class="icon">
                    <xiv-icon icon={this.icon} size={16}/>
                </div>
            );
        }

        return (
            <div class="icon">
                <fa-icon 
                    name={this.icon} 
                    size={16} type="duotone"
                    color="#c0facf"
                />
            </div>
        );
    }
}
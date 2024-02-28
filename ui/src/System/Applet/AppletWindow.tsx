/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractApplet } from "@/System/Applet/AbstractApplet";
import { AppletConfig as AppletContext } from "@/System/Applet/AppletContext";
import { AppletRepository } from "@/System/Applet/AppletRepository";
import { AbstractComponent, Attribute, UIComponent, Watch } from "@/System/Interface";
import { Bound } from "@/System/Types";

@UIComponent('lux-applet-window', '/css/base/lux-applet-window.css')
export class AppletWindow extends AbstractComponent
{
    @Attribute public identifier: string;
    @Attribute public component: string;
    @Attribute public argument: string;
    @Attribute public state: string;

    private isConfigMode: boolean = false;
    private isMoving: boolean = false;
    private element: HTMLElement;
    private instance: AbstractApplet;
    private title: string;
    private isFrameless: boolean;
    private posX: number = 150;
    private posY: number = 150;
    private width: number = 100;
    private minWidth: number = 100;
    private height: number = 100;
    private minHeight: number = 100;

    public override onCreated(): void
    {
        const applet = AppletRepository.get(this.component);
        this.element = document.createElement(applet.tagName);
        this.minWidth = applet.options.minWidth;
        this.minHeight = applet.options.minHeight;
        this.width = this.minWidth;
        this.height = this.minHeight;
        this.instance = (this.element as any).$component;
        this.title = applet.options.name;
        this.isFrameless = applet.options.isFrameless;

        if (! this.instance) {
            throw new Error(`Applet '${this.component}' is not a valid component.`);
        }

        const config = new AppletContext(applet.options, JSON.parse(this.argument));
        config.on('name', v => this.title = v);
        config.on('isFrameless', v => this.isFrameless = v);

        Object.defineProperty(this.instance, 'context', { get: () => config });
    }

    public override onMounted(): void
    {
        // this.$host.shadowRoot.querySelector('#content').appendChild(this.element);
    }

    public render()
    {
        return (
            <ui:host
                on:$mousedown={this.onHostMouseDown}
                style={{
                    '--x': `${this.posX}px`,
                    '--y': `${this.posY}px`,
                    '--min-width': this.width + 'px',
                    '--min-height': this.height + 'px',
                }}
            >
                <main class={{frameless: this.isFrameless}}>
                    {!this.isFrameless && (
                        <header
                            on:$mousedown={this.onConfigMouseDown}
                            on:$mouseup={this.onConfigMouseUp}
                            on:$mousemove={this.onConfigMouseMove}
                            on:$mouseleave={this.onMouseLeave}
                        >
                            <div class="title">{this.title}</div>
                            <div>
                                <button class="ghost" on:click={() => this.isConfigMode = !this.isConfigMode}>
                                    <fa-icon name="cog" type="solid" size={12}/>
                                </button>
                                <button class="ghost" on:click={() => this.$host.remove()}>
                                    <fa-icon name="times" type="regular"/>
                                </button>
                            </div>
                        </header>
                    )}
                    <div id="content" html:raw={this.element}/>
                </main>
                {this.isConfigMode && (
                    <div 
                        id="config"
                        on:$mousedown={this.onConfigMouseDown}
                        on:$mouseup={this.onConfigMouseUp}
                        on:$mousemove={this.onConfigMouseMove}
                        on:$mouseleave={this.onMouseLeave}
                        on:$wheel={this.onConfigWheel}
                    >
                        {this.width > 400 && this.height > 200 && (
                            <div>
                                <ul>
                                    <li><code>Left mouse + drag</code><span>to move the window around.</span></li>
                                    <li><code>Mouse wheel</code><span>to resize the window horizontally.</span></li>
                                    <li><code>Mouse wheel + shift</code><span>to resize the window vertically.</span></li>
                                </ul>
                                <i>
                                    You can access this mode anytime by clicking the <code>mouse wheel</code> while holding the <code>control key</code>.
                                </i>
                            </div>
                        )}
                        <button class="large" on:click={() => this.isConfigMode = !this.isConfigMode}>
                            <fa-icon name="check"/> Ready
                        </button>
                    </div>
                )}
            </ui:host>
        )
    }

    @Bound private onHostMouseDown(e: MouseEvent): void
    {
        if (!this.isConfigMode && e.button === 1 && e.ctrlKey) {
            this.isConfigMode = true;
        }
    }

    @Bound private onConfigMouseDown(e: MouseEvent): void
    {
        if (e.button !== 0 || e.composedPath().find((el: HTMLElement) => el.tagName?.toLowerCase() === 'button')) {
            return;
        }

        this.isMoving  = true;
    }

    @Bound private onConfigMouseUp(e: MouseEvent): void
    {
        this.isMoving = false;
        this.dispatchState();
    }

    @Bound private onConfigMouseMove(e: MouseEvent): void
    {
        if (! this.isMoving) {
            return;
        }

        this.posX += e.movementX;
        this.posY += e.movementY;
    }
    
    @Bound private onMouseLeave(): void
    {
        if (this.isMoving) {
            this.isMoving = false;
            this.dispatchState();
        }
    }

    @Bound private onConfigWheel(e: WheelEvent): void
    {
        let value = (e.deltaY > 0 ? 1 : -1) * (e.ctrlKey ? 1 : 10);

        if (e.shiftKey) {
            this.height = Math.max(this.minHeight, this.height + value);
        } else {
            this.width = Math.max(this.minWidth, this.width + value);
        }

        this.dispatchState();
    }

    private dispatchState(): void
    {
        this.$host.dispatchEvent(new CustomEvent('state-changed', {
            detail: {
                x: this.posX,
                y: this.posY,
                width: this.width,
                height: this.height,
            }
        }));
    }

    @Watch('state', true)
    private onStateChange(value: string): void
    {
        if (!value) {
            return;
        }

        const state = JSON.parse(value);
        if (! state) {
            return;
        }

        this.posX = state.x;
        this.posY = state.y;
        this.width = state.width;
        this.height = state.height;
    }
}

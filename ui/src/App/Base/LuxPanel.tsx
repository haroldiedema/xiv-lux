/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Attribute, UIComponent, Watch } from "@/System/Interface";

@UIComponent('lux-panel', '/css/base/lux-panel.css')
export class LuxPanel extends AbstractComponent
{
    @Attribute public anchor: HTMLElement;
    @Attribute public hidden: boolean;

    private a: string;
    private x: number;
    private y: number;

    private rafHandle: number;
    private isZeroWidth: boolean = true;

    public render()
    {
        return (
            <ui:host 
                style={this.getStyle()} 
                class={{hidden: this.hidden, isZeroWidth: this.isZeroWidth}}
            >
                <slot/>
            </ui:host>
        )
    }

    private getStyle()
    {
        switch (this.a) {
            case 'top-left':
                return { top: this.y + 'px', left: this.x + 'px', bottom: 'unset', right: 'unset' };
            case 'top-right':
                return { top: this.y + 'px', right: this.x + 'px', bottom: 'unset', left: 'unset' };
            case 'bottom-left':
                return { bottom: this.y + 'px', left: this.x + 'px', top: 'unset', right: 'unset' };
            case 'bottom-right':
                return { bottom: this.y + 'px', right: this.x + 'px', top: 'unset', left: 'unset' };
            default:
                return { top: this.y + 'px', left: this.x + 'px', bottom: 'unset', right: 'unset' };
        }
    }

    @Watch('parent')
    private onParentChanged(parent: HTMLElement)
    {
    }

    @Watch('hidden')
    private onHiddenChanged(hidden: boolean)
    {
        if (hidden) {
            return cancelAnimationFrame(this.rafHandle);
        }

        this.tick();
    }

    private tick()
    {
        this.rafHandle = requestAnimationFrame(() => this.tick());
        
        const aRect = this.anchor.getBoundingClientRect();
        const sRect = this.$host.getBoundingClientRect();

        this.isZeroWidth = sRect.width === 0;

        let vAnchor = 'top',
            hAnchor = 'left', 
            x = aRect.x, 
            y = aRect.height;

        if (aRect.y > window.innerHeight / 2) {
            vAnchor = 'bottom';
        }

        if (aRect.x > window.innerWidth / 2) {
            hAnchor = 'right';
            x = (window.innerWidth - aRect.x) - aRect.width;
        }

        const offset = (sRect.width > 0) ? ((aRect.width / 2) - (sRect.width / 2)) : 0;

        this.a = `${vAnchor}-${hAnchor}`;
        this.x = x + offset;
        this.y = y;
    }
}
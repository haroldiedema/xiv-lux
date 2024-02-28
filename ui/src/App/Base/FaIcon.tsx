/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Attribute, Inject, UIComponent, Watch } from "@/System/Interface";
import { Service } from "@/System/Services";

type Icon = {
    box: number[];
    types: {
        [type: string]: string[];
    };
}

@Service({initializer: i => i.initialize()})
export class FaIconLib
{
    public readonly icons: Map<string, Icon> = new Map();

    public async initialize(): Promise<void>
    {
        const data = await fetch('/iconlib.json').then(r => r.json());

        data.forEach((i: any) => {
            this.icons.set(i.name, i);

            i.terms.forEach((term: string) => {
                if (false == this.icons.has(term)) {
                    this.icons.set(term, i);
                }
            });
        });
    }
}

@UIComponent('fa-icon', '/css/base/fa-icon.css')
export class FaIcon extends AbstractComponent
{
    @Attribute public name: string;
    @Attribute public type: string = 'regular';
    @Attribute public size: number = 16;
    @Attribute public invert: boolean = false;
    @Attribute public color: string = '#fff';
    @Attribute public color2: string = null;
    @Attribute public rotate: string = '0deg';

    @Inject private readonly lib: FaIconLib;

    private svg: string = '';

    public render()
    {
        return (
            <ui:host style={{
                '--size': this.size + 'px',
                '--color': this.color,
                '--alt-color': this.color2,
                '--rotate': this.rotate,
            }}>
                <main html:raw={this.svg}></main>
            </ui:host>
        );
    }

    @Watch('name', true)
    private onNameChanged(): void
    {
        const icon = this.lib.icons.get(this.name);
        if (! icon) {
            throw new Error(`Icon '${this.name}' does not exist.`);
        }

        const paths = icon.types[this.type]?.map(p => `<path d="${p}"/>`) ?? null;
        if (! paths) {
            throw new Error(`Icon '${this.name}' does not have a type '${this.type}'.`);
        }

        if (this.invert) {
            paths.reverse();
        }

        this.svg = `<svg viewBox="${icon.box.join(' ')}">${paths}</svg>`;
    }
}

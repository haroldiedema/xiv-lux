/* Lux'Materia                                       .____
 *   Game Engine                                     |    |    __ _____  ___ '_____ _____ _____ _____ _____ _____ _____
 *                                                   |    |   |  |  \  \/  / |     |  _  |_   _|   __| __  |     |  _  |
 * (C)2023 Harold Iedema <harold@iedema.me>          |    |___|  |  />    <  | | | |     | | | |   __|    -|-   -|     |
 * See LICENSE for licensing details                 |_______ \____//__/\_ \ |_|_|_|__|__| |_| |_____|__|__|_____|__|__|
 * --------------------------------------------------------- \/ --------- */

import { AbstractComponent, ComponentConstructor } from '@/System/Interface/Component';
import { UIElement } from '@/System/Interface/Element';

/**
 * @autoload
 */
export function UIComponent(tagName: string, styleUrl: string = null)
{
    return (target: ComponentConstructor<AbstractComponent>) =>
    {
        Reflect.defineMetadata('ui:tag', tagName, target);

        customElements.define(tagName, class extends UIElement<any>
        {
            constructor()
            {
                super(target, styleUrl);
            }

            static get observedAttributes()
            {
                return target.__metadata__?.attributes.map(attr => attr.name) ?? [];
            }
        });
    };
}

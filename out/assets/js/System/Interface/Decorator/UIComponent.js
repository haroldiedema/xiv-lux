/* Lux'Materia                                       .____
 *   Game Engine                                     |    |    __ _____  ___ '_____ _____ _____ _____ _____ _____ _____
 *                                                   |    |   |  |  \  \/  / |     |  _  |_   _|   __| __  |     |  _  |
 * (C)2023 Harold Iedema <harold@iedema.me>          |    |___|  |  />    <  | | | |     | | | |   __|    -|-   -|     |
 * See LICENSE for licensing details                 |_______ \____//__/\_ \ |_|_|_|__|__| |_| |_____|__|__|_____|__|__|
 * --------------------------------------------------------- \/ --------- */
import { UIElement } from '@/System/Interface/Element';
/**
 * @autoload
 */
export function UIComponent(tagName, styleUrl = null) {
    return (target) => {
        Reflect.defineMetadata('ui:tag', tagName, target);
        customElements.define(tagName, class extends UIElement {
            constructor() {
                super(target, styleUrl);
            }
            static get observedAttributes() {
                return target.__metadata__?.attributes.map(attr => attr.name) ?? [];
            }
        });
    };
}
//# sourceMappingURL=UIComponent.js.map
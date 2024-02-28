/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class MapContext {
    constructor() {
        /**
         * True if the current zone is the one the player is currently in.
         */
        this.isCurrentZone = false;
        /**
         * The zone to render.
         */
        this.zone = null;
        /**
         * The position to center the camera on.
         * If no position is set, the camera will center on the player or the target.
         */
        this.focusPosition = null;
    }
}
//# sourceMappingURL=MapContext.js.map
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { Drawing } from "@/App/Applets/WorldMap/Renderer/Viewport/Drawing";
export class Canvas extends Drawing {
    constructor(camera, scissor, icons, viewport) {
        super();
        this.camera = camera;
        this.scissor = scissor;
        this.icons = icons;
        this.viewport = viewport;
        this.canvas = new OffscreenCanvas(2, 2);
        this.context = this.canvas.getContext('2d');
        viewport.on('resized', (e) => {
            this.canvas.width = e.width;
            this.canvas.height = e.height;
        });
    }
    /**
     * Clears the canvas.
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=Canvas.js.map
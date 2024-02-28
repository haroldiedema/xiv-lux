/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { Inject, Service } from "@/System/Services";
import { Rect } from "@/System/Types";
import { Vec2 } from "@/XIV/Models/Vec2";

@Service()
export class Scissor
{
    @Inject private readonly camera: Camera;

    private readonly viewport: Rect = { x: 0, y: 0, width: 0, height: 0 };
    private readonly scissor: Rect = { x: 0, y: 0, width: 0, height: 0 };

    public resize(width: number, height: number)
    {
        this.viewport.width = width;
        this.viewport.height = height;
    }

    public update()
    {
        const camera = this.camera.position;
        const zoom = this.camera.zoom;

        this.scissor.x = camera.x - this.viewport.width / zoom / 2;
        this.scissor.y = camera.y - this.viewport.height / zoom / 2;
        this.scissor.width = this.viewport.width / zoom;
        this.scissor.height = this.viewport.height / zoom;
    }

    public get rect(): Rect
    {
        return this.scissor;
    }

    /**
     * Returns the screen position of the given map texture position.
     */
    public getScreenPosition(v: Vec2): Vec2
    {
        return new Vec2(
            (v.x - this.scissor.x) * this.camera.zoom,
            (v.y - this.scissor.y) * this.camera.zoom
        );
    }
}

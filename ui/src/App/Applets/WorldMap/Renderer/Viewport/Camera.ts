/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { MathUtils } from "@/System/Math/MathUtils";
import { Service } from "@/System/Services";
import { Size } from "@/System/Types";
import { Vec2 } from "@/XIV/Models/Vec2";


@Service()
export class Camera
{
    public static ZOOM_MIN = 0.25;
    public static ZOOM_MAX = 6.0;
    public static MAP_SIZE = 2048;

    private readonly sourcePosition: Vec2 = new Vec2(1024, 1024).mut();
    private readonly targetPosition: Vec2 = new Vec2(1024, 1024).mut();
    private readonly offsetPosition: Vec2 = new Vec2(0, 0).mut();

    private sourceZoomFactor: number = 1.0;
    private targetZoomFactor: number = 1.0;
    private tempZoomFactor: number = 0;

    public update(viewportSize: Size, deltaTime: number)
    {
        let zoomFactor = this.tempZoomFactor || this.sourceZoomFactor;

        zoomFactor = MathUtils.clamp(zoomFactor, Math.max(viewportSize.width, viewportSize.height) / Camera.MAP_SIZE, Camera.ZOOM_MAX);
        this.targetZoomFactor = MathUtils.interpolate(this.targetZoomFactor, zoomFactor, deltaTime * (this.tempZoomFactor ? 0.0005 : 0.0075));

        const minX = viewportSize.width / 2 / this.targetZoomFactor;
        const minY = viewportSize.height / 2 / this.targetZoomFactor;
        const maxX = Camera.MAP_SIZE - minX;
        const maxY = Camera.MAP_SIZE - minY;

        this.sourcePosition.clamp(minX, minY, maxX, maxY);
        this.offsetPosition.clamp(minX - this.sourcePosition.x, minY - this.sourcePosition.y, maxX - this.sourcePosition.x, maxY - this.sourcePosition.y);

        const pos = this.sourcePosition.clone().add(this.offsetPosition).clamp(minX, minY, maxX, maxY);

        this.targetPosition.lerp(pos, deltaTime * 0.0075);
        this.targetPosition.clamp(minX, minY, maxX, maxY);
    }

    public set position(v: Vec2)
    {
        this.sourcePosition.copyFrom(v);
    }

    public get position(): Vec2
    {
        return this.targetPosition;
    }

    public get offset(): Vec2
    {
        return this.offsetPosition;
    }

    public get zoom(): number
    {
        return this.targetZoomFactor;
    }

    public zoomIn(): void
    {
        this.sourceZoomFactor = MathUtils.clamp(this.sourceZoomFactor * 1.1, Camera.ZOOM_MIN, Camera.ZOOM_MAX);
    }

    public zoomOut(): void
    {
        this.sourceZoomFactor = MathUtils.clamp(this.sourceZoomFactor * 0.9, Camera.ZOOM_MIN, Camera.ZOOM_MAX);
    }

    public setTempZoom(factor: number): void
    {
        this.tempZoomFactor = MathUtils.clamp(factor, Camera.ZOOM_MIN, Camera.ZOOM_MAX);
    }

    public clearTempZoom(): void
    {
        this.tempZoomFactor = null;
    }

    public resetZoom(): void
    {
        this.sourceZoomFactor = .5;
    }
}

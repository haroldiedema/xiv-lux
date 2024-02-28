/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Inject, Service } from "@/System/Services";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { Zone } from "@/XIV/Models/Generated";

@Service()
export class InputHandler
{
    @Inject private readonly camera: Camera;
    @Inject private readonly raycaster: Raycaster;
    @Inject private readonly invoker: Invoker;
    @Inject private readonly socket: Socket;

    private _canvas: HTMLCanvasElement;
    private _isPanning: boolean = false;
    private _currentZone: Zone = null;
    private _zone: Zone = null;

    constructor()
    {
        this.socket.on('CurrentZone', zone => this._currentZone = zone);
        this.socket.on('SelectedZone', zone => this._zone = zone);
    }

    public attach(canvas: HTMLCanvasElement): void
    {
        this._canvas = canvas;

        this.raycaster.attach(canvas);

        canvas.addEventListener('wheel', this.onMouseWheel);
        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('dblclick', this.onDoubleClick);
    }

    public detach(): void
    {
        this.raycaster.detach();

        this._canvas.removeEventListener('wheel', this.onMouseWheel);
        this._canvas.removeEventListener('mousedown', this.onMouseDown);
        this._canvas.removeEventListener('dblclick', this.onDoubleClick);
    }

    @Bound private onMouseWheel(e: WheelEvent): void
    {
        e.deltaY > 0 ? this.camera.zoomOut() : this.camera.zoomIn();
    }

    @Bound private onMouseDown(e: MouseEvent): void
    {
        if (e.button === 0) {
            this._isPanning = true;

            window.addEventListener('mousemove', this.onWindowMouseMove);
            window.addEventListener('mouseup', this.onWindowMouseUp);
            document.body.addEventListener('mouseleave', this.onWindowMouseLeave);

            return;
        }

        // Add/remove flag marker.
        if (e.button === 1) {
            if (e.shiftKey) {
                this.invoker.zone.removeFlagMarker();
                return;
            }

            this.invoker.zone.setFlagMarker(this._zone.id, this._zone.territoryId, this.raycaster.cursor.x, this.raycaster.cursor.y);
            if (this._currentZone?.id !== this._zone.id) {
                this.camera.offset.set(0, 0);
            }
        }
    }

    @Bound private onWindowMouseMove(e: MouseEvent): void
    {
        if (!this._isPanning) {
            return;
        }

        this.camera.offset.x -= e.movementX / this.camera.zoom;
        this.camera.offset.y -= e.movementY / this.camera.zoom;
    }

    @Bound private onWindowMouseUp(e: MouseEvent): void
    {
        if (e.button === 0) {
            this._isPanning = false;
            this.onWindowMouseMove(e);
        }
    }

    @Bound private onWindowMouseLeave(e: MouseEvent): void
    {
        this._isPanning = false;

        window.removeEventListener('mousemove', this.onWindowMouseMove);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
        document.body.removeEventListener('mouseleave', this.onWindowMouseLeave);
    }

    @Bound private onDoubleClick(e: MouseEvent): void
    {
        this.camera.offset.set(0, 0);
    }
}
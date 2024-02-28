/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { IRaycasterHandler } from "@/App/Applets/WorldMap/Interaction/Handlers/IRaycasterHandler";
import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { Inject, InjectTagged, Service } from "@/System/Services";
import { Bound, Size } from "@/System/Types";
import { Vec2 } from "@/XIV/Models";

@Service()
export class Raycaster
{
    public readonly cursor: Vec2 = new Vec2().mut();

    @Inject private readonly camera: Camera;
    @Inject private readonly scissor: Scissor;

    @InjectTagged('world-map.raycaster.handler')
    private readonly handlers: IRaycasterHandler[];

    private candidates: RaycasterCandidate[] = [];
    private hit: RaycasterCandidate = null;
    private canvas: HTMLCanvasElement;
    private downPos: Vec2 = new Vec2().mut();
    private downTime: number = 0;

    constructor()
    {
    }

    public attach(canvas: HTMLCanvasElement): void
    {
        this.canvas = canvas;

        canvas.addEventListener('mousemove', this.onMouseMove);
        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('mouseup', this.onMouseUp);
    }

    public detach(): void
    {
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
    }

    public reset(): void
    {
        this.candidates = [];
    }

    public addCandidate(candidate: RaycasterCandidate): void
    {
        this.candidates.push(candidate);
    }

    public isHit(id: string): boolean
    {
        return this.hit?.id === id;
    }

    public get hitCandidate(): RaycasterCandidate | null
    {
        return this.hit;
    }

    @Bound private onMouseMove(e: MouseEvent): void
    {
        this.cursor.set(
            (e.offsetX / this.camera.zoom) + this.scissor.rect.x,
            (e.offsetY / this.camera.zoom) + this.scissor.rect.y,
        );

        this.hit = null;
        let hits = [];

        this.candidates.forEach(candidate =>
        {
            const w = candidate.size.width / 2;
            const h = candidate.size.height / 2;

            if (this.cursor.x >= candidate.position.x - w &&
                this.cursor.x <= candidate.position.x + w &&
                this.cursor.y >= candidate.position.y - h &&
                this.cursor.y <= candidate.position.y + h
            ) {
                hits.unshift(candidate);
            }
        });

        // Sort by distance.
        hits = hits.sort((a, b) => a.position.distanceTo(this.cursor) - b.position.distanceTo(this.cursor));
        this.hit = hits[0] ?? null;
    }

    @Bound private onMouseDown(e: MouseEvent): void
    {
        if (!this.hit) {
            return;
        }

        this.downPos.copyFrom(this.cursor);
        this.downTime = Date.now();
    }

    @Bound private onMouseUp(e: MouseEvent): void
    {
        if (!this.hit) {
            return;
        }

        if (this.downPos.distanceTo(this.cursor) > 10 || Date.now() - this.downTime > 200) {
            return;
        }

        this.handlers.forEach((handler) =>
        {
            if (handler.supports(this.hit)) {
                handler.handle(this.hit);
            }
        });
    }
}

export type RaycasterCandidate = {
    id: string;
    position: Vec2;
    size: Size;
    metadata?: Record<string, any>;
};
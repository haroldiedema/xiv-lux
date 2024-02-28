/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { MapContext } from "@/App/Applets/WorldMap/Renderer/MapContext";
import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { Canvas } from "@/App/Applets/WorldMap/Renderer/Viewport/Canvas";
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { Viewport } from "@/App/Applets/WorldMap/Renderer/Viewport/Viewport";
import { Inject } from "@/System/Services";
import { Rect, Size } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { NpcActor, PlayerActor, GatheringNodeActor, Vec2 } from "@/XIV/Models";
import { IconRepository } from "@/XIV/Texture/IconRepository";

export abstract class AbstractLayer
{
    public renderOrder: number = 0;

    @Inject private readonly _camera: Camera;
    @Inject private readonly _scissor: Scissor;
    @Inject private readonly _viewport: Viewport;
    @Inject private readonly _icons: IconRepository;
    @Inject private readonly _actors: ActorManager;
    @Inject private readonly _raycaster: Raycaster;

    protected readonly canvas: Canvas;
    protected autoClear: boolean = true;
    protected deltaTime: number = 0;
    protected elapsedTime: number = 0;
    protected mapContext: MapContext = null;

    constructor()
    {
        this.canvas = new Canvas(this._camera, this._scissor, this._icons, this._viewport);
        this.init();
    }

    public render(context: MapContext, deltaTime: number, elapsedTime: number): CanvasImageSource | null
    {
        if (!this._actors.player) {
            return;
        }

        if (this.autoClear) {
            this.canvas.clear();
        }

        this.mapContext = context;
        this.deltaTime = deltaTime;
        this.elapsedTime = elapsedTime;

        this.draw();

        return this.canvas.canvas;
    }

    protected abstract init(): void;
    protected abstract draw(): void;

    protected get player(): PlayerActor
    {
        return this._actors.player;
    }

    protected get players(): PlayerActor[]
    {
        return this._actors.players;
    }

    protected get npcs(): NpcActor[]
    {
        return this._actors.npcs;
    }

    protected get gatheringNodes(): GatheringNodeActor[]
    {
        return this._actors.gatheringNodes;
    }

    protected get camera(): Vec2
    {
        return this._camera.position;
    }

    protected get zoom(): number
    {
        return this._camera.zoom;
    }

    protected get scissor(): Rect
    {
        return this._scissor.rect;
    }

    protected get viewportSize(): Size
    {
        return this._viewport.size;
    }

    protected get hasCustomCameraOffset(): boolean
    {
        return this._camera.offset.length() > 0;
    }

    protected getIcon(iconId: number): CanvasImageSource
    {
        return this._icons.getCached(iconId);
    }

    protected addRaycasterCandidate(id: string, position: Vec2, size: Size, metadata: Record<string, any> = {}): void
    {
        this._raycaster.addCandidate({ id, position, size, metadata });
    }

    protected isRaycasterHit(id: string): boolean
    {
        return this._raycaster.isHit(id);
    }
}

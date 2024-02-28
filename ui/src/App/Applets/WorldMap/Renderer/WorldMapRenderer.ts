/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { MapContext } from "@/App/Applets/WorldMap/Renderer/MapContext";
import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { InputHandler } from "@/App/Applets/WorldMap/Interaction/InputHandler";
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { Viewport } from "@/App/Applets/WorldMap/Renderer/Viewport/Viewport";
import { WorldMapRendererEvents } from "@/App/Applets/WorldMap/Renderer/WorldMapRendererEvents";
import { EventEmitter } from "@/System/Event";
import { Inject, InjectTagged, Service } from "@/System/Services";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { GameState } from "@/XIV/GameState";
import { Vec2 } from "@/XIV/Models";
import { FlagMarker, Zone } from "@/XIV/Models/Generated";

@Service()
export class WorldMapRenderer extends EventEmitter<WorldMapRendererEvents>
{
    @Inject private readonly camera: Camera;
    @Inject private readonly scissor: Scissor;
    @Inject private readonly viewport: Viewport;
    @Inject private readonly raycaster: Raycaster;
    @Inject private readonly inputs: InputHandler;
    @Inject private readonly socket: Socket;
    @Inject private readonly actors: ActorManager;
    @Inject private readonly gameState: GameState;
    @Inject private readonly invoker: Invoker;

    public readonly mapContext: MapContext;

    @InjectTagged('world-map.layer')
    private readonly unsortedLayers: AbstractLayer[];
    private readonly sortedLayers: AbstractLayer[];

    private currentZone: Zone;
    private SelectedZone: Zone;
    private rafHandle: number;
    private isCustomOffset: boolean = false;
    private flagMarker: FlagMarker = null;

    constructor()
    {
        super();

        this.sortedLayers = this.unsortedLayers.sort((a, b) => a.renderOrder - b.renderOrder);
        this.mapContext = new MapContext();

        this.socket.on('CurrentZone', this.onCurrentZoneChanged);
        this.socket.on('SelectedZone', this.onSelectedZoneChanged);
        this.socket.on('FlagMarker', marker => this.flagMarker = marker);
    }

    public attach(canvas: HTMLCanvasElement): void
    {
        this.viewport.attach(canvas);
        this.inputs.attach(canvas);

        this.rafHandle = requestAnimationFrame(t => this.update(t, t));
    }

    public detach(): void
    {
        this.viewport.detach();
        this.inputs.detach();

        cancelAnimationFrame(this.rafHandle);
    }

    public get hasFlagInSelectedZone(): boolean
    {
        return this.flagMarker?.mapId === this.mapContext.zone?.id;
    }

    public get isSelectedZoneDifferentFromCurrent(): boolean
    {
        return this.currentZone?.id !== this.mapContext.zone?.id;
    }

    public resetSelectedZone(): void
    {
        if (!this.currentZone) {
            return;
        }

        this.invoker.zone.setSelectedZone(this.currentZone?.id);
    }

    private update(time: number, lastTime: number): void
    {
        if (!this.actors.player || !this.currentZone) {
            this.rafHandle = requestAnimationFrame(t => this.update(t, time));
            return;
        }

        this.raycaster.reset();

        if (this.currentZone?.id === this.mapContext.zone?.id) {
            // Current zone camera.
            if (this.camera.offset.length() === 0) {
                if (this.isCustomOffset) {
                    this.isCustomOffset = false;
                    this.dispatch('custom-offset-deactivated');
                }
                this.camera.position = this.mapContext.focusPosition
                    || this.actors.player.target?.position
                    || this.actors.player.position;
            } else {
                if (!this.isCustomOffset) {
                    this.isCustomOffset = true;
                    this.dispatch('custom-offset-activated');
                }
            }
        } else if (this.flagMarker && this.flagMarker.mapId === this.mapContext.zone?.id && this.flagMarker.territoryId === this.mapContext.zone.territoryId) {
            // Selected zone camera.
            this.camera.position = this.flagMarker?.position ?? new Vec2(1024, 1024);
        }

        if (this.camera.offset.length() === 0 && this.gameState.isInCombat && this.actors.player?.target) {
            this.camera.setTempZoom(6.0);
        } else {
            this.camera.clearTempZoom();
        }

        const deltaTime: number = time - lastTime;

        this.viewport.clear();
        this.camera.update(this.viewport.size, deltaTime);
        this.scissor.update();

        for (const layer of this.sortedLayers) {
            this.viewport.compose(layer.render(this.mapContext, deltaTime, time));
        }

        this.rafHandle = requestAnimationFrame(t => this.update(t, time));
    }

    @Bound private onCurrentZoneChanged(zone: Zone): void
    {
        this.currentZone = zone;
        this.mapContext.isCurrentZone = zone?.id === this.SelectedZone?.id;
        this.camera.offset.set(0, 0);
        this.dispatch('current-zone-changed', zone);
    }

    @Bound private onSelectedZoneChanged(zone: Zone): void
    {
        this.SelectedZone = zone;
        this.mapContext.zone = zone;
        this.mapContext.isCurrentZone = zone?.id === this.currentZone?.id;

        if (this.currentZone?.id === zone?.id) {
            this.camera.offset.set(0, 0);
        } else {
            this.camera.resetZoom();
        }

        this.dispatch('selected-zone-changed', zone);
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MapContext } from "@/App/Applets/WorldMap/Renderer/MapContext";
import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { InputHandler } from "@/App/Applets/WorldMap/Interaction/InputHandler";
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Scissor } from "@/App/Applets/WorldMap/Renderer/Viewport/Scissor";
import { Viewport } from "@/App/Applets/WorldMap/Renderer/Viewport/Viewport";
import { EventEmitter } from "@/System/Event";
import { Inject, InjectTagged, Service } from "@/System/Services";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { GameState } from "@/XIV/GameState";
import { Vec2 } from "@/XIV/Models";
import { Zone } from "@/XIV/Models/Generated";
let WorldMapRenderer = class WorldMapRenderer extends EventEmitter {
    constructor() {
        super();
        this.isCustomOffset = false;
        this.flagMarker = null;
        this.sortedLayers = this.unsortedLayers.sort((a, b) => a.renderOrder - b.renderOrder);
        this.mapContext = new MapContext();
        this.socket.on('CurrentZone', this.onCurrentZoneChanged);
        this.socket.on('SelectedZone', this.onSelectedZoneChanged);
        this.socket.on('FlagMarker', marker => this.flagMarker = marker);
    }
    attach(canvas) {
        this.viewport.attach(canvas);
        this.inputs.attach(canvas);
        this.rafHandle = requestAnimationFrame(t => this.update(t, t));
    }
    detach() {
        this.viewport.detach();
        this.inputs.detach();
        cancelAnimationFrame(this.rafHandle);
    }
    get hasFlagInSelectedZone() {
        return this.flagMarker?.mapId === this.mapContext.zone?.id;
    }
    get isSelectedZoneDifferentFromCurrent() {
        return this.currentZone?.id !== this.mapContext.zone?.id;
    }
    resetSelectedZone() {
        if (!this.currentZone) {
            return;
        }
        this.invoker.zone.setSelectedZone(this.currentZone?.id);
    }
    update(time, lastTime) {
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
            }
            else {
                if (!this.isCustomOffset) {
                    this.isCustomOffset = true;
                    this.dispatch('custom-offset-activated');
                }
            }
        }
        else if (this.flagMarker && this.flagMarker.mapId === this.mapContext.zone?.id && this.flagMarker.territoryId === this.mapContext.zone.territoryId) {
            // Selected zone camera.
            this.camera.position = this.flagMarker?.position ?? new Vec2(1024, 1024);
        }
        if (this.camera.offset.length() === 0 && this.gameState.isInCombat && this.actors.player?.target) {
            this.camera.setTempZoom(6.0);
        }
        else {
            this.camera.clearTempZoom();
        }
        const deltaTime = time - lastTime;
        this.viewport.clear();
        this.camera.update(this.viewport.size, deltaTime);
        this.scissor.update();
        for (const layer of this.sortedLayers) {
            this.viewport.compose(layer.render(this.mapContext, deltaTime, time));
        }
        this.rafHandle = requestAnimationFrame(t => this.update(t, time));
    }
    onCurrentZoneChanged(zone) {
        this.currentZone = zone;
        this.mapContext.isCurrentZone = zone?.id === this.SelectedZone?.id;
        this.camera.offset.set(0, 0);
        this.dispatch('current-zone-changed', zone);
    }
    onSelectedZoneChanged(zone) {
        this.SelectedZone = zone;
        this.mapContext.zone = zone;
        this.mapContext.isCurrentZone = zone?.id === this.currentZone?.id;
        if (this.currentZone?.id === zone?.id) {
            this.camera.offset.set(0, 0);
        }
        else {
            this.camera.resetZoom();
        }
        this.dispatch('selected-zone-changed', zone);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Camera)
], WorldMapRenderer.prototype, "camera", void 0);
__decorate([
    Inject,
    __metadata("design:type", Scissor)
], WorldMapRenderer.prototype, "scissor", void 0);
__decorate([
    Inject,
    __metadata("design:type", Viewport)
], WorldMapRenderer.prototype, "viewport", void 0);
__decorate([
    Inject,
    __metadata("design:type", Raycaster)
], WorldMapRenderer.prototype, "raycaster", void 0);
__decorate([
    Inject,
    __metadata("design:type", InputHandler)
], WorldMapRenderer.prototype, "inputs", void 0);
__decorate([
    Inject,
    __metadata("design:type", Socket)
], WorldMapRenderer.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", ActorManager)
], WorldMapRenderer.prototype, "actors", void 0);
__decorate([
    Inject,
    __metadata("design:type", GameState)
], WorldMapRenderer.prototype, "gameState", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], WorldMapRenderer.prototype, "invoker", void 0);
__decorate([
    InjectTagged('world-map.layer'),
    __metadata("design:type", Array)
], WorldMapRenderer.prototype, "unsortedLayers", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Zone]),
    __metadata("design:returntype", void 0)
], WorldMapRenderer.prototype, "onCurrentZoneChanged", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Zone]),
    __metadata("design:returntype", void 0)
], WorldMapRenderer.prototype, "onSelectedZoneChanged", null);
WorldMapRenderer = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], WorldMapRenderer);
export { WorldMapRenderer };
//# sourceMappingURL=WorldMapRenderer.js.map
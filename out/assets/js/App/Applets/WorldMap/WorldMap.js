var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { jsx as _jsx, jsxs as _jsxs } from "@/System/Interface/jsx-runtime";
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { Camera } from "@/App/Applets/WorldMap/Renderer/Viewport/Camera";
import { WorldMapRenderer } from "@/App/Applets/WorldMap/Renderer/WorldMapRenderer";
import { AbstractApplet, Applet } from "@/System/Applet";
import { Inject } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { StaticMarkerKind, Zone } from "@/XIV/Models/Generated";
let WorldMap = class WorldMap extends AbstractApplet {
    constructor() {
        super(...arguments);
        this.eventSubscribers = [];
        this.isInCurrentZone = true;
        this.isCustomOffset = false;
        this.currentZone = null;
        this.selectedZone = null;
        this.flagMarker = null;
        this.showToolbar = false;
        this.layers = [];
        this.layerSwapDebounce = 0;
        this.popOutX = 0;
        this.popOutH = 0;
        this.popOutA = 'right';
        this.questMarkers = [];
        this.mousePos = '';
    }
    onMounted() {
        const canvas = this.$host.shadowRoot.querySelector('canvas');
        this.renderer.attach(canvas);
        this.socket.subscribe('CurrentZone', this.onCurrentZoneChanged);
        this.socket.subscribe('SelectedZone', this.onSelectedZoneChanged);
        this.socket.subscribe('FlagMarker', marker => this.flagMarker = marker);
        this.socket.subscribe('QuestMarkers', markers => this.questMarkers = markers);
        this.eventSubscribers.push(this.renderer.on('custom-offset-activated', this.onCustomOffsetActivated), this.renderer.on('custom-offset-deactivated', this.onCustomOffsetDeactivated));
        const _update = () => {
            const rect = this.$host.getBoundingClientRect();
            this.popOutX = rect.width;
            this.popOutH = rect.height;
            this.popOutA = rect.x < (window.innerWidth / 2) ? 'right' : 'left';
            let windowName = this.currentZone?.placeName ?? '';
            if (this.actors.player) {
                const pos = this.actors.player.position.toMapCoordinates(this.currentZone);
                windowName += ` (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`;
            }
            this.context.name = windowName;
            if (this.selectedZone) {
                const pos = this.raycaster.cursor.toMapCoordinates(this.selectedZone);
                this.mousePos = `(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`;
            }
            this.rafHandle = requestAnimationFrame(() => _update());
        };
        _update();
    }
    onDisposed() {
        cancelAnimationFrame(this.rafHandle);
        this.eventSubscribers.forEach(s => s.unsubscribe());
        this.renderer.detach();
    }
    render() {
        return (_jsxs("ui:host", { "on:$mouseenter": () => this.showToolbar = true, "on:$mouseleave": () => this.showToolbar = false, children: [_jsx("canvas", {}), _jsx("xiv-world-map-info", { x: this.popOutX + 7, height: this.popOutH, anchor: this.popOutA }), _jsx("main", { children: _jsxs("nav", { class: { hidden: !this.showToolbar }, children: [_jsxs("section", { children: [this.renderRegionZoneButton(), this.renderResetSelectedZoneButton(), this.renderResetOffsetButton(), this.renderOpenFlagMapButton(), this.renderTeleportFlagButton(), this.renderRemoveFlagButton(), this.renderEmoteQuestFlagButton()] }), _jsxs("section", { children: [_jsx("code", { children: this.mousePos }), this.layers.length > 0 && (_jsx("select", { disabled: this.layerSwapDebounce > 0, value: this.selectedZone?.id, "on:change": (e) => {
                                            if (this.layerSwapDebounce) {
                                                return;
                                            }
                                            var mapId = parseInt(e.target.value);
                                            if (isNaN(mapId) || mapId === this.selectedZone?.id) {
                                                return;
                                            }
                                            this.invoker.zone.setSelectedZone(mapId);
                                            this.layerSwapDebounce = setTimeout(() => this.layerSwapDebounce = 0, 500);
                                        }, children: this.layers.map(layer => (_jsx("option", { value: layer.id, selected: this.selectedZone?.id === layer.id, children: layer.placeNameSub }))) }))] })] }) })] }));
    }
    renderRegionZoneButton() {
        return (_jsx("xiv-world-map-toolbar-button", { icon: "60541", tooltip: `Go to ${this.selectedZone?.regionZone?.placeName}`, disabled: !this.selectedZone?.regionZone?.id, "on:click": () => this.invoker.zone.setSelectedZone(this.selectedZone.regionZone.id) }));
    }
    renderResetSelectedZoneButton() {
        if (this.isInCurrentZone) {
            return;
        }
        return (_jsx("xiv-world-map-toolbar-button", { icon: "60644", tooltip: "Go back to the current zone.", disabled: this.isInCurrentZone, "on:click": () => this.renderer.resetSelectedZone() }));
    }
    renderResetOffsetButton() {
        if (!this.isInCurrentZone) {
            return;
        }
        return (_jsx("xiv-world-map-toolbar-button", { icon: "60914", tooltip: "Reset the camera back to the player.", disabled: !this.isCustomOffset || !this.isInCurrentZone, "on:click": () => this.camera.offset.set(0, 0) }));
    }
    renderOpenFlagMapButton() {
        if (this.flagMarker && this.flagMarker.mapId === this.selectedZone?.id) {
            return;
        }
        let isDisabled = !this.selectedZone || !this.flagMarker;
        return (_jsx("xiv-world-map-toolbar-button", { icon: "60561", icon2: "63968", tooltip: "Open the map where the flag is at.", disabled: isDisabled, "on:click": () => this.invoker.zone.setSelectedZone(this.flagMarker.mapId) }));
    }
    renderTeleportFlagButton() {
        if (!this.flagMarker || (this.flagMarker && this.flagMarker.mapId !== this.selectedZone?.id)) {
            return;
        }
        let isDisabled = !this.selectedZone || !this.flagMarker || this.flagMarker.mapId !== this.selectedZone?.id;
        // If there are no available aetherytes in the area, return.
        if (!this.selectedZone?.staticMarkers.filter(marker => marker.kind === StaticMarkerKind.Aetheryte).length) {
            isDisabled = true;
        }
        return (_jsx("xiv-world-map-toolbar-button", { icon: "60561", icon2: "60959", tooltip: "Teleport to an aetheryte near the flag.", disabled: isDisabled, "on:click": () => this.teleportToFlag() }));
    }
    renderRemoveFlagButton() {
        return (_jsx("xiv-world-map-toolbar-button", { icon: "60561", icon2: "61552", tooltip: "Right-click to remove the flag.", disabled: !this.flagMarker, "on:mousedown": (e) => {
                if (e.button === 2)
                    this.invoker.zone.removeFlagMarker();
            } }));
    }
    renderEmoteQuestFlagButton() {
        if (!this.isInCurrentZone) {
            return;
        }
        // Find map markers with quests that have an emote reward.
        const emoteRewardQuests = this.questMarkers.filter(qm => qm.quest.rewards.emote);
        if (emoteRewardQuests.length === 0) {
            return;
        }
        const qm = emoteRewardQuests[0];
        return (_jsx("xiv-world-map-toolbar-button", { icon: qm.quest.rewards.emote.iconId, tooltip: `Set a flag on the map for the quest with the ${qm.quest.rewards.emote.name} emote reward.`, disabled: emoteRewardQuests.length === 0, "on:click": () => {
                this.invoker.zone.setFlagMarker(this.currentZone.id, this.currentZone.territoryId, qm.position.x, qm.position.y);
            } }));
    }
    onCurrentZoneChanged(zone) {
        this.currentZone = zone;
        this.isInCurrentZone = this.currentZone?.id === this.selectedZone?.id;
    }
    onSelectedZoneChanged(zone) {
        this.context.name = zone?.placeName;
        this.selectedZone = zone;
        this.isInCurrentZone = this.currentZone?.id === this.selectedZone?.id;
        this.layers = [];
        if (zone?.layers) {
            this.enqueueDeferredTask(() => {
                this.layers = zone.layers.length < 2 ? [] : [...zone.layers];
            });
        }
    }
    onCustomOffsetActivated() {
        this.isCustomOffset = true;
    }
    onCustomOffsetDeactivated() {
        this.isCustomOffset = false;
    }
    /**
     * Teleports the player to the nearest aetheryte near the flag.
     */
    teleportToFlag() {
        const aetherytes = this.selectedZone.staticMarkers.filter(marker => marker.kind === StaticMarkerKind.Aetheryte);
        if (aetherytes.length === 0) {
            return;
        }
        // Find the closest aetheryte.
        const target = aetherytes.sort((a, b) => a.position.distanceTo(this.flagMarker.position) - b.position.distanceTo(this.flagMarker.position))[0];
        if (!target || !target.metadata?.aetheryteId) {
            return;
        }
        this.invoker.aetheryte.teleport(target.metadata.aetheryteId);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], WorldMap.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", Camera)
], WorldMap.prototype, "camera", void 0);
__decorate([
    Inject,
    __metadata("design:type", ActorManager)
], WorldMap.prototype, "actors", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], WorldMap.prototype, "invoker", void 0);
__decorate([
    Inject,
    __metadata("design:type", WorldMapRenderer)
], WorldMap.prototype, "renderer", void 0);
__decorate([
    Inject,
    __metadata("design:type", Raycaster)
], WorldMap.prototype, "raycaster", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Zone]),
    __metadata("design:returntype", void 0)
], WorldMap.prototype, "onCurrentZoneChanged", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Zone]),
    __metadata("design:returntype", void 0)
], WorldMap.prototype, "onSelectedZoneChanged", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorldMap.prototype, "onCustomOffsetActivated", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorldMap.prototype, "onCustomOffsetDeactivated", null);
WorldMap = __decorate([
    Applet('xiv-world-map', {
        name: 'World Map',
        description: 'Displays a world map.',
        styleUrl: '/css/applets/xiv-world-map.css',
        icon: 'map',
        isFrameless: false,
        isSingleInstance: true,
        minWidth: 600,
        minHeight: 450,
    })
], WorldMap);
export { WorldMap };
//# sourceMappingURL=WorldMap.js.map
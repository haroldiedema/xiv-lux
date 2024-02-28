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
import { EventSubscriber } from "@/System/Event";
import { Inject } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { FlagMarker, QuestMarker, StaticMarkerKind, Zone, ZoneReference } from "@/XIV/Models/Generated";

@Applet('xiv-world-map', {
    name            : 'World Map',
    description     : 'Displays a world map.',
    styleUrl        : '/css/applets/xiv-world-map.css',
    icon            : 'map',
    isFrameless     : false,
    isSingleInstance: true,
    minWidth        : 600,
    minHeight       : 450,
})
export class WorldMap extends AbstractApplet
{
    @Inject private readonly socket: Socket;
    @Inject private readonly camera: Camera;
    @Inject private readonly actors: ActorManager;
    @Inject private readonly invoker: Invoker;
    @Inject private readonly renderer: WorldMapRenderer;
    @Inject private readonly raycaster: Raycaster;

    private readonly eventSubscribers: EventSubscriber<any>[] = [];

    private isInCurrentZone: boolean = true;
    private isCustomOffset: boolean = false;
    private currentZone: Zone = null;
    private selectedZone: Zone = null;
    private flagMarker: FlagMarker = null;
    private showToolbar: boolean = false;
    private layers: ZoneReference[] = [];
    private layerSwapDebounce: number = 0;
    private popOutX: number = 0;
    private popOutH: number = 0;
    private popOutA: string = 'right';
    private rafHandle: number;
    private questMarkers: QuestMarker[] = [];
    private mousePos: string = '';

    public override onMounted(): void
    {
        const canvas = this.$host.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
        this.renderer.attach(canvas);

        this.socket.subscribe('CurrentZone', this.onCurrentZoneChanged);
        this.socket.subscribe('SelectedZone', this.onSelectedZoneChanged);
        this.socket.subscribe('FlagMarker', marker => this.flagMarker = marker);
        this.socket.subscribe('QuestMarkers', markers => this.questMarkers = markers);
        
        this.eventSubscribers.push(
            this.renderer.on('custom-offset-activated', this.onCustomOffsetActivated),
            this.renderer.on('custom-offset-deactivated', this.onCustomOffsetDeactivated),
        );

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

    public override onDisposed(): void
    {
        cancelAnimationFrame(this.rafHandle);

        this.eventSubscribers.forEach(s => s.unsubscribe());
        this.renderer.detach();
    }

    public override render()
    {
        return (
            <ui:host
                on:$mouseenter={() => this.showToolbar = true}
                on:$mouseleave={() => this.showToolbar = false}
            >
                <canvas/>

                <xiv-world-map-info
                    x={this.popOutX + 7}
                    height={this.popOutH}
                    anchor={this.popOutA}
                />

                <main>
                    <nav class={{hidden: !this.showToolbar}}>
                        <section>
                            {this.renderRegionZoneButton()}
                            {this.renderResetSelectedZoneButton()}
                            {this.renderResetOffsetButton()}
                            {this.renderOpenFlagMapButton()}
                            {this.renderTeleportFlagButton()}
                            {this.renderRemoveFlagButton()}
                            {this.renderEmoteQuestFlagButton()}
                        </section>
                        <section>
                            <code>{this.mousePos}</code>
                            {this.layers.length > 0 && (
                                <select
                                    disabled={this.layerSwapDebounce > 0}
                                    value={this.selectedZone?.id}
                                    on:change={(e: Event) => {
                                        if (this.layerSwapDebounce) {
                                            return;
                                        }

                                        var mapId = parseInt((e.target as HTMLSelectElement).value as any);
                                        if (isNaN(mapId) || mapId === this.selectedZone?.id) {
                                            return;
                                        }

                                        this.invoker.zone.setSelectedZone(mapId);
                                        this.layerSwapDebounce = setTimeout(() => this.layerSwapDebounce = 0, 500);
                                    }}
                                >
                                    {this.layers.map(layer => (
                                        <option value={layer.id} selected={this.selectedZone?.id === layer.id}>
                                            {layer.placeNameSub}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </section>
                    </nav>
                </main>
            </ui:host>
        );
    }

    private renderRegionZoneButton()
    {
        return (
            <xiv-world-map-toolbar-button
                icon="60541"
                tooltip={`Go to ${this.selectedZone?.regionZone?.placeName}`}
                disabled={!this.selectedZone?.regionZone?.id}
                on:click={() => this.invoker.zone.setSelectedZone(this.selectedZone.regionZone.id)}
            />
        );
    }

    private renderResetSelectedZoneButton()
    {
        if (this.isInCurrentZone) {
            return;
        }

        return (
            <xiv-world-map-toolbar-button
                icon="60644"
                tooltip="Go back to the current zone."
                disabled={this.isInCurrentZone}
                on:click={() => this.renderer.resetSelectedZone()}
            />
        )
    }

    private renderResetOffsetButton()
    {
        if (! this.isInCurrentZone) {
            return;
        }

        return (
            <xiv-world-map-toolbar-button
                icon="60914"
                tooltip="Reset the camera back to the player."
                disabled={!this.isCustomOffset || !this.isInCurrentZone}
                on:click={() => this.camera.offset.set(0, 0)}
            />
        );
    }

    private renderOpenFlagMapButton()
    {
        if (this.flagMarker && this.flagMarker.mapId === this.selectedZone?.id) {
            return;
        }
        
        let isDisabled = !this.selectedZone || !this.flagMarker;

        return (
            <xiv-world-map-toolbar-button
                icon="60561"
                icon2="63968"
                tooltip="Open the map where the flag is at."
                disabled={isDisabled}
                on:click={() => this.invoker.zone.setSelectedZone(this.flagMarker.mapId)}
            />
        );
    }

    private renderTeleportFlagButton()
    {
        if (!this.flagMarker || (this.flagMarker && this.flagMarker.mapId !== this.selectedZone?.id)) {
            return;
        }

        let isDisabled = !this.selectedZone || !this.flagMarker || this.flagMarker.mapId !== this.selectedZone?.id;

        // If there are no available aetherytes in the area, return.
        if (!this.selectedZone?.staticMarkers.filter(marker => marker.kind === StaticMarkerKind.Aetheryte).length) {
            isDisabled = true;
        }

        return (
            <xiv-world-map-toolbar-button
                icon="60561"
                icon2="60959"
                tooltip="Teleport to an aetheryte near the flag."
                disabled={isDisabled}
                on:click={() => this.teleportToFlag()}
            />
        );
    }

    private renderRemoveFlagButton()
    {
        return (
            <xiv-world-map-toolbar-button
                icon="60561"
                icon2="61552"
                tooltip="Right-click to remove the flag."
                disabled={!this.flagMarker}
                on:mousedown={(e) => {
                    if (e.button === 2) this.invoker.zone.removeFlagMarker();
                }}
            />
        );
    }

    private renderEmoteQuestFlagButton()
    {
        if (! this.isInCurrentZone) {
            return;
        }

        // Find map markers with quests that have an emote reward.
        const emoteRewardQuests = this.questMarkers.filter(qm => qm.quest.rewards.emote);
        if (emoteRewardQuests.length === 0) {
            return;
        }

        const qm = emoteRewardQuests[0];

        return (
            <xiv-world-map-toolbar-button
                icon={qm.quest.rewards.emote.iconId}
                tooltip={`Set a flag on the map for the quest with the ${qm.quest.rewards.emote.name} emote reward.`}
                disabled={emoteRewardQuests.length === 0}
                on:click={() => {
                    this.invoker.zone.setFlagMarker(this.currentZone.id, this.currentZone.territoryId, qm.position.x, qm.position.y);
                }}
            />
        );
    }

    @Bound private onCurrentZoneChanged(zone: Zone): void
    {
        this.currentZone  = zone;
        this.isInCurrentZone = this.currentZone?.id === this.selectedZone?.id;
    }

    @Bound private onSelectedZoneChanged(zone: Zone): void
    {
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

    @Bound private onCustomOffsetActivated(): void
    {
        this.isCustomOffset = true;
    }

    @Bound private onCustomOffsetDeactivated(): void
    {
        this.isCustomOffset = false;
    }

    /**
     * Teleports the player to the nearest aetheryte near the flag.
     */
    private teleportToFlag(): void
    {
        const aetherytes = this.selectedZone.staticMarkers.filter(marker => marker.kind === StaticMarkerKind.Aetheryte);
        if (aetherytes.length === 0) {
            return;
        }

        // Find the closest aetheryte.
        const target = aetherytes.sort((a, b) => a.position.distanceTo(this.flagMarker.position) - b.position.distanceTo(this.flagMarker.position))[0];
        if (! target || !target.metadata?.aetheryteId) {
            return;
        }

        this.invoker.aetheryte.teleport(target.metadata.aetheryteId);
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { StaticMarker } from "@/XIV/Models";
import { StaticMarkerKind, Zone } from "@/XIV/Models/Generated";

@UIComponent("lux-toolbar-location", "/css/toolbar/lux-toolbar-location.css")
export class LuxToolbarLocation extends AbstractComponent
{
    @Inject private readonly socket: Socket;
    @Inject private readonly actors: ActorManager;
    @Inject private readonly invoker: Invoker;

    private zone: Zone = null;
    private aetheryte: StaticMarker = null;
    private aetheryteName: string = null;
    private rafHandle: number = null;
    private showPanel: boolean = false;
    private savedLocations: SavedLocation[] = [];

    public override onMounted(): void
    {
        this.socket.subscribe('CurrentZone', this.onCurrentZoneChanged);
        
        this.findClosestAetheryte();
        this.loadSavedLocations();
    }

    public override onDisposed(): void
    {
        cancelAnimationFrame(this.rafHandle);
    }

    public render()
    {
        if (!this.zone) {
            return (
                <ui:host ui-key={2}/>
            );
        }

        return (
            <ui:host ui-key={3}
                on:$mousedown={() => this.showPanel = true}
                on:$mouseleave={() => this.showPanel = false}
            >
                <div class="icon">
                    <xiv-icon icon={60453} size={20} filter={this.aetheryte ? null : 'grayscale(100%)'}/>
                </div>
                {this.aetheryte ? (
                    <div class="name" ui-key="a">
                        <div>{this.zone.placeName}</div>
                        <div>{this.aetheryteName}</div>
                    </div>
                ) : (
                    <div>{this.zone.placeName}</div>
                )}
                <lux-panel anchor={this.$host} hidden={!this.showPanel}>
                    {this.renderLocationPanel()}
                </lux-panel>
            </ui:host>
        );
    }

    private renderLocationPanel()
    {
        return (
            <main>
                <header>Saved locations</header>
                <section>
                    {this.savedLocations.length === 0 ? (
                        <div>No saved locations.</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Region</th>
                                    <th>Aetheryte</th>
                                    <th/>
                                </tr>
                            </thead>
                            <tbody>
                            {this.savedLocations.map((loc, index) => (
                                <tr on:click={(e) => this.onLocationClick(e, loc)}>
                                    <td>{loc.place}</td>
                                    <td>{loc.name}</td>
                                    <td>
                                        <div>
                                            <button on:click={() => this.moveLocationUp(loc)} class={`icon ghost ${index === 0 ? 'disabled' : ''}`}>
                                                <fa-icon name="arrow-up" size={12}/>
                                            </button>
                                            <button on:click={() => this.moveLocationDown(loc)} class={`icon ghost ${index === this.savedLocations.length - 1 ? 'disabled' : ''}`}>
                                                <fa-icon name="arrow-down" size={12}/>
                                            </button>
                                            <button on:mousedown={(e) => e.button === 2 && this.removeLocation(loc)} class="icon ghost">
                                                <fa-icon name="trash-alt" size={12}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </section>
                {this.canSaveLocation && (
                    <footer>
                        <button on:$click={() => this.saveCurrentLocation()}>
                            Add {this.aetheryteName}.
                        </button>
                    </footer>
                )}
            </main>
        )
    }

    @Bound private onCurrentZoneChanged(zone: Zone): void
    {
        this.zone = zone;
        console.log(zone);
    }

    @Bound private findClosestAetheryte(): void
    {
        if (! this.zone || ! this.actors.player) {
            this.rafHandle = requestAnimationFrame(this.findClosestAetheryte);
            this.aetheryte = null;
            return;
        }

        // Figure out if this zone has any aetherytes.
        const aetherytes = this.zone.staticMarkers.filter(marker => marker.kind === StaticMarkerKind.Aetheryte);

        // Find the aetheryte that is closest to the player.
        let closestAetheryte = null;
        let closestDistance = Infinity;

        for (const aetheryte of aetherytes) {
            const distance = this.actors.player.position.distanceTo(aetheryte.position);
            if (distance < closestDistance) {
                closestAetheryte = aetheryte;
                closestDistance = distance;
            }
        }

        this.aetheryteName = closestAetheryte?.name;
        
        if (! this.aetheryteName) {
            this.aetheryteName = this.zone.staticMarkers.find(m => m.iconId === 60448)?.name ?? this.zone.placeNameSub ?? this.zone.placeName;
        }

        this.aetheryte = closestAetheryte;
        this.rafHandle = requestAnimationFrame(this.findClosestAetheryte);
    }

    private loadSavedLocations(): void
    {
        this.savedLocations = JSON.parse(localStorage.getItem('lux-saved-locations') || '[]');
    }

    private saveCurrentLocation(): void
    {
        if (!this.zone || !this.aetheryte) {
            return;
        }

        this.loadSavedLocations();

        this.savedLocations.push({
            id: this.aetheryte.metadata['aetheryteId'],
            name: this.aetheryteName,
            place: this.zone.placeName
        });

        this.savedLocations = [...this.savedLocations];

        localStorage.setItem('lux-saved-locations', JSON.stringify(this.savedLocations));
    }

    private get isLocationSaved(): boolean
    {
        if (!this.zone || !this.aetheryte) {
            return false;
        }

        return this.savedLocations.some(loc => loc.id === this.aetheryte.metadata['aetheryteId']);
    }

    private get canSaveLocation(): boolean
    {
        return this.zone && this.aetheryte && !this.isLocationSaved;
    }

    private removeLocation(loc: SavedLocation): void
    {
        const index = this.savedLocations.indexOf(loc);
        if (index === -1) {
            return;
        }

        this.savedLocations.splice(index, 1);

        localStorage.setItem('lux-saved-locations', JSON.stringify(this.savedLocations));
    }

    private moveLocationUp(loc: SavedLocation): void
    {
        const index = this.savedLocations.indexOf(loc);
        if (index === 0) {
            return;
        }

        const temp = this.savedLocations[index - 1];
        this.savedLocations[index - 1] = loc;
        this.savedLocations[index] = temp;

        localStorage.setItem('lux-saved-locations', JSON.stringify(this.savedLocations));
    }

    private moveLocationDown(loc: SavedLocation): void
    {
        const index = this.savedLocations.indexOf(loc);
        if (index === this.savedLocations.length - 1) {
            return;
        }

        const temp = this.savedLocations[index + 1];
        this.savedLocations[index + 1] = loc;
        this.savedLocations[index] = temp;

        localStorage.setItem('lux-saved-locations', JSON.stringify(this.savedLocations));
    }

    private onLocationClick(e: MouseEvent, loc: SavedLocation): void
    {
        if (e.composedPath().some(el => el instanceof HTMLButtonElement)) {
            return;
        }

        this.invoker.aetheryte.teleport(loc.id);
    }
}

type SavedLocation = {
    // Aetheryte ID.
    id: number;

    // Name of the aetheryte.
    name: string;

    // Name of the zone.
    place: string;
}

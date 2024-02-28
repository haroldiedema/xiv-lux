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
import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { StaticMarkerKind, Zone } from "@/XIV/Models/Generated";
let LuxToolbarLocation = class LuxToolbarLocation extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.zone = null;
        this.aetheryte = null;
        this.aetheryteName = null;
        this.rafHandle = null;
        this.showPanel = false;
        this.savedLocations = [];
    }
    onMounted() {
        this.socket.subscribe('CurrentZone', this.onCurrentZoneChanged);
        this.findClosestAetheryte();
        this.loadSavedLocations();
    }
    onDisposed() {
        cancelAnimationFrame(this.rafHandle);
    }
    render() {
        if (!this.zone) {
            return (_jsx("ui:host", { "ui-key": 2 }));
        }
        return (_jsxs("ui:host", { "ui-key": 3, "on:$mousedown": () => this.showPanel = true, "on:$mouseleave": () => this.showPanel = false, children: [_jsx("div", { class: "icon", children: _jsx("xiv-icon", { icon: 60453, size: 20, filter: this.aetheryte ? null : 'grayscale(100%)' }) }), this.aetheryte ? (_jsxs("div", { class: "name", "ui-key": "a", children: [_jsx("div", { children: this.zone.placeName }), _jsx("div", { children: this.aetheryteName })] })) : (_jsx("div", { children: this.zone.placeName })), _jsx("lux-panel", { anchor: this.$host, hidden: !this.showPanel, children: this.renderLocationPanel() })] }));
    }
    renderLocationPanel() {
        return (_jsxs("main", { children: [_jsx("header", { children: "Saved locations" }), _jsx("section", { children: this.savedLocations.length === 0 ? (_jsx("div", { children: "No saved locations." })) : (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Region" }), _jsx("th", { children: "Aetheryte" }), _jsx("th", {})] }) }), _jsx("tbody", { children: this.savedLocations.map((loc, index) => (_jsxs("tr", { "on:click": (e) => this.onLocationClick(e, loc), children: [_jsx("td", { children: loc.place }), _jsx("td", { children: loc.name }), _jsx("td", { children: _jsxs("div", { children: [_jsx("button", { "on:click": () => this.moveLocationUp(loc), class: `icon ghost ${index === 0 ? 'disabled' : ''}`, children: _jsx("fa-icon", { name: "arrow-up", size: 12 }) }), _jsx("button", { "on:click": () => this.moveLocationDown(loc), class: `icon ghost ${index === this.savedLocations.length - 1 ? 'disabled' : ''}`, children: _jsx("fa-icon", { name: "arrow-down", size: 12 }) }), _jsx("button", { "on:mousedown": (e) => e.button === 2 && this.removeLocation(loc), class: "icon ghost", children: _jsx("fa-icon", { name: "trash-alt", size: 12 }) })] }) })] }))) })] })) }), this.canSaveLocation && (_jsx("footer", { children: _jsxs("button", { "on:$click": () => this.saveCurrentLocation(), children: ["Add ", this.aetheryteName, "."] }) }))] }));
    }
    onCurrentZoneChanged(zone) {
        this.zone = zone;
        console.log(zone);
    }
    findClosestAetheryte() {
        if (!this.zone || !this.actors.player) {
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
        if (!this.aetheryteName) {
            this.aetheryteName = this.zone.staticMarkers.find(m => m.iconId === 60448)?.name ?? this.zone.placeNameSub ?? this.zone.placeName;
        }
        this.aetheryte = closestAetheryte;
        this.rafHandle = requestAnimationFrame(this.findClosestAetheryte);
    }
    loadSavedLocations() {
        this.savedLocations = JSON.parse(localStorage.getItem('lux-saved-locations') || '[]');
    }
    saveCurrentLocation() {
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
    get isLocationSaved() {
        if (!this.zone || !this.aetheryte) {
            return false;
        }
        return this.savedLocations.some(loc => loc.id === this.aetheryte.metadata['aetheryteId']);
    }
    get canSaveLocation() {
        return this.zone && this.aetheryte && !this.isLocationSaved;
    }
    removeLocation(loc) {
        const index = this.savedLocations.indexOf(loc);
        if (index === -1) {
            return;
        }
        this.savedLocations.splice(index, 1);
        localStorage.setItem('lux-saved-locations', JSON.stringify(this.savedLocations));
    }
    moveLocationUp(loc) {
        const index = this.savedLocations.indexOf(loc);
        if (index === 0) {
            return;
        }
        const temp = this.savedLocations[index - 1];
        this.savedLocations[index - 1] = loc;
        this.savedLocations[index] = temp;
        localStorage.setItem('lux-saved-locations', JSON.stringify(this.savedLocations));
    }
    moveLocationDown(loc) {
        const index = this.savedLocations.indexOf(loc);
        if (index === this.savedLocations.length - 1) {
            return;
        }
        const temp = this.savedLocations[index + 1];
        this.savedLocations[index + 1] = loc;
        this.savedLocations[index] = temp;
        localStorage.setItem('lux-saved-locations', JSON.stringify(this.savedLocations));
    }
    onLocationClick(e, loc) {
        if (e.composedPath().some(el => el instanceof HTMLButtonElement)) {
            return;
        }
        this.invoker.aetheryte.teleport(loc.id);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], LuxToolbarLocation.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", ActorManager)
], LuxToolbarLocation.prototype, "actors", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], LuxToolbarLocation.prototype, "invoker", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Zone]),
    __metadata("design:returntype", void 0)
], LuxToolbarLocation.prototype, "onCurrentZoneChanged", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LuxToolbarLocation.prototype, "findClosestAetheryte", null);
LuxToolbarLocation = __decorate([
    UIComponent("lux-toolbar-location", "/css/toolbar/lux-toolbar-location.css")
], LuxToolbarLocation);
export { LuxToolbarLocation };
//# sourceMappingURL=LuxToolbarLocation.js.map
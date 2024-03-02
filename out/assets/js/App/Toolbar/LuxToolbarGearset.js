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
import { PlayerActor } from "@/XIV/Models";
import { GearsetState } from "@/XIV/Models/Generated";
import { Job, RoleMap } from "@/XIV/Types";
let LuxToolbarGearset = class LuxToolbarGearset extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.showPanel = false;
        this.player = null;
        this.gearset = null;
        this.curIndex = 0;
        this.changeTimer = null;
        this.changingGearset = false;
        this.tankSets = [];
        this.healerSets = [];
        this.meleeSets = [];
        this.rangedSets = [];
        this.casterSets = [];
        this.crafterSets = [];
        this.gathererSets = [];
    }
    /**
     * @inheritdoc
     */
    onMounted() {
        this.socket.subscribe('Gearset', this.onGearsetStateUpdated);
        this.socket.subscribe('PlayerActor', this.onPlayerActorUpdated);
    }
    /**
     * @inheritdoc
     */
    render() {
        if (!this.player || !this.gearset) {
            return _jsx("ui:host", {});
        }
        return (_jsxs("ui:host", { children: [_jsxs("main", { class: RoleMap[Job[this.gearset.classJobId]], "on:click": () => this.showPanel = !this.showPanel, children: [_jsx("xiv-icon", { icon: 62000 + this.gearset.classJobId, size: 24 }), _jsxs("div", { children: [_jsx("div", { class: "name", children: this.player.name }), _jsxs("div", { class: "job", children: ["Lv. ", this.player.level, " ", this.gearset.name] })] })] }), _jsx("div", { id: "panel-wrapper", class: { 'hidden': !this.showPanel }, "on:mousedown": (e) => {
                        if (e.composedPath()[0].id === 'panel-wrapper') {
                            this.showPanel = false;
                        }
                    }, children: _jsxs("div", { id: "panel", children: [_jsxs("section", { children: [_jsx("header", { children: "Diciple of War / Magic" }), _jsxs("div", { class: "flex-h", children: [_jsxs("div", { class: "flex-v job-list", children: [_jsx("div", { class: "category", children: _jsx("span", { children: "Tank" }) }), this.tankSets.map((gs, i) => this.renderGearset(gs)), _jsx("div", { class: "category", children: _jsx("span", { children: "Melee DPS" }) }), this.meleeSets.map((gs, i) => this.renderGearset(gs))] }), _jsxs("div", { class: "flex-v job-list", children: [_jsx("div", { class: "category", children: _jsx("span", { children: "Healer" }) }), this.healerSets.map((gs, i) => this.renderGearset(gs)), _jsx("div", { class: "category", children: _jsx("span", { children: "Caster DPS" }) }), this.casterSets.map((gs, i) => this.renderGearset(gs)), _jsx("div", { class: "category", children: _jsx("span", { children: "Ranged DPS" }) }), this.rangedSets.map((gs, i) => this.renderGearset(gs))] })] })] }), _jsxs("section", { children: [_jsx("header", { children: "Diciple of the Hand / Land" }), _jsx("div", { class: "flex-h", children: _jsxs("div", { class: "flex-v job-list", children: [_jsx("div", { class: "category", children: _jsx("span", { children: "Gatherer" }) }), this.gathererSets.map((gs, i) => this.renderGearset(gs)), _jsx("div", { class: "category", children: _jsx("span", { children: "Crafter" }) }), this.crafterSets.map((gs, i) => this.renderGearset(gs))] }) })] })] }) })] }));
    }
    renderGearset(gs) {
        return (_jsxs("div", { class: `job${gs.id === this.curIndex ? ' active' : ''}`, "on:click": () => this.changeGearset(gs.id), children: [_jsx("xiv-icon", { icon: 62100 + gs.classJobId, size: 32 }), _jsx("xiv-icon", { icon: gs.mainHand.iconId, size: 32, class: "weapon" }), _jsxs("div", { class: "info", children: [_jsxs("div", { class: "name", children: [gs.name, _jsx("span", { children: gs.itemLevel })] }), _jsx("div", { class: "weap", children: gs.mainHand.name })] })] }));
    }
    onGearsetStateUpdated(state) {
        if (!state) {
            this.curIndex = 0;
            this.gearset = null;
            return;
        }
        this.curIndex = state.currentIndex;
        this.gearset = state.gearsets[this.curIndex] ?? null;
        this.tankSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'tank').sort((a, b) => a.name.localeCompare(b.name));
        this.healerSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'healer').sort((a, b) => a.name.localeCompare(b.name));
        this.meleeSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'melee-dps').sort((a, b) => a.name.localeCompare(b.name));
        this.rangedSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'ranged-dps').sort((a, b) => a.name.localeCompare(b.name));
        this.casterSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'caster-dps').sort((a, b) => a.name.localeCompare(b.name));
        this.crafterSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'crafter').sort((a, b) => a.name.localeCompare(b.name));
        this.gathererSets = state.gearsets.filter(gs => RoleMap[Job[gs.classJobId]] === 'gatherer').sort((a, b) => a.name.localeCompare(b.name));
    }
    onPlayerActorUpdated(player) {
        this.player = player;
    }
    changeGearset(index) {
        clearTimeout(this.changeTimer);
        if (this.changingGearset) {
            console.warn('Already changing gearset.');
            return;
        }
        this.changingGearset = true;
        this.showPanel = false;
        this.changeTimer = setTimeout(() => {
            this.invoker.gearset.setCurrentGearset(index);
            this.changeTimer = setTimeout(() => {
                this.invoker.chat.send(Math.random() < 0.51 ? '/bstance' : '/vpose');
                this.changingGearset = false;
            }, 100);
        }, 50);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], LuxToolbarGearset.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], LuxToolbarGearset.prototype, "invoker", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GearsetState]),
    __metadata("design:returntype", void 0)
], LuxToolbarGearset.prototype, "onGearsetStateUpdated", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayerActor]),
    __metadata("design:returntype", void 0)
], LuxToolbarGearset.prototype, "onPlayerActorUpdated", null);
LuxToolbarGearset = __decorate([
    UIComponent('lux-toolbar-gearset', '/css/toolbar/lux-toolbar-gearset.css')
], LuxToolbarGearset);
export { LuxToolbarGearset };
//# sourceMappingURL=LuxToolbarGearset.js.map
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
import { CompanionCommand, CompanionState } from "@/XIV/Models/Generated";
let LuxToolbarGearset = class LuxToolbarGearset extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.showPanel = false;
        this.companion = null;
        this.xpPercent = 0;
        this.summoning = false;
    }
    /**
     * @inheritdoc
     */
    onMounted() {
        this.socket.subscribe('CompanionState', this.onCompanionStateUpdated);
    }
    /**
     * @inheritdoc
     */
    render() {
        if (!this.companion) {
            return _jsx("ui:host", {});
        }
        if (this.companion.timeLeft > 0) {
            return (_jsxs("ui:host", { children: [_jsxs("main", { "ui-key": "active", "on:click": () => this.showPanel = !this.showPanel, children: [_jsx("xiv-icon", { icon: this.companion.iconId, size: 20 }), _jsxs("div", { children: [_jsxs("div", { class: "name", children: [this.companion.name, this.xpPercent > 99 && this.companion.level < 20 ? ' (LEVEL UP)' : ''] }), _jsx("div", { class: "info", children: this.secondsToMMSS(this.companion.timeLeft) })] })] }), _jsx("div", { "ui-key": "panel", id: "panel-wrapper", "on:click": (e) => e.composedPath()[0]?.id === 'panel-wrapper' && (this.showPanel = false), class: { hidden: !this.showPanel }, children: _jsxs("div", { id: "panel", children: [_jsxs("div", { class: "header", children: [_jsx("div", { class: "name", children: this.companion.name }), _jsxs("div", { class: "info", children: [_jsxs("div", { children: ["Lv. ", this.companion.level, ", ", this.commandName] }), _jsxs("div", { class: "xp", children: [_jsx("div", { class: "current", children: this.companion.currentXP.toLocaleString('nl') }), _jsx("span", { children: "/" }), _jsx("div", { class: "max", children: this.companion.maxXP.toLocaleString('nl') })] })] })] }), _jsx("div", { class: "progress", children: _jsx("div", { class: "bar", style: { width: `${this.xpPercent}%` } }) }), _jsxs("div", { class: "time-left", children: [_jsxs("div", { children: [_jsx("div", { class: "label", children: "Time Left" }), _jsx("div", { class: "value", children: this.secondsToMMSS(this.companion.timeLeft) })] }), _jsx("div", { children: _jsxs("button", { class: { large: true, disabled: !this.companion.canSummon || this.summoning || this.minutesToAdd < 1 }, "on:click": () => this.useGrysahlGreens(), children: [_jsx("xiv-icon", { icon: 25218, size: 24 }), _jsx("span", { children: !this.companion.canSummon ? 'No Grysahl Greens' : `Add ${this.minutesToAdd} minutes` })] }) })] }), _jsxs("div", { class: "actions", children: [this.drawStanceButton(CompanionCommand.Follow, 'Follow'), this.drawStanceButton(CompanionCommand.FreeStance, 'Free Stance'), this.drawStanceButton(CompanionCommand.AttackerStance, 'Attacker'), this.drawStanceButton(CompanionCommand.DefenderStance, 'Defender'), this.drawStanceButton(CompanionCommand.HealerStance, 'Healer')] }), _jsx("footer", { children: _jsxs("button", { class: "ghost", "on:click": () => this.invoker.companion.setCommand(2), children: ["Withdraw from battlefield", _jsx("xiv-icon", { icon: 901, size: 24 })] }) })] }) })] }));
        }
        return (_jsx("ui:host", { children: _jsxs("main", { "ui-key": "inactive", "on:click": () => this.useGrysahlGreens(), class: {
                    unavailable: !this.companion.canSummon
                }, children: [_jsx("xiv-icon", { icon: this.companion.iconId, size: 20 }), _jsxs("div", { children: [_jsx("div", { class: "name", children: this.companion.name }), _jsxs("div", { class: "info", children: ["Lv. ", this.companion.level] })] })] }) }));
    }
    drawStanceButton(command, label) {
        return (_jsxs("button", { class: { stance: true, large: true, active: this.companion.command === command }, "on:click": () => this.invoker.companion.setCommand(command), children: [_jsx("xiv-icon", { icon: this.getCommandIcon(command), size: 24 }), label] }));
    }
    get commandName() {
        switch (this.companion.command) {
            case CompanionCommand.Unknown: return 'Unknown';
            case CompanionCommand.Follow: return 'Loyal follower';
            case CompanionCommand.FreeStance: return 'Free Roamer';
            case CompanionCommand.AttackerStance: return 'Attacker';
            case CompanionCommand.DefenderStance: return 'Defender';
            case CompanionCommand.HealerStance: return 'Healer';
        }
    }
    getCommandIcon(command) {
        switch (command) {
            case CompanionCommand.Unknown: return 0;
            case CompanionCommand.Follow: return 902;
            case CompanionCommand.FreeStance: return 906;
            case CompanionCommand.AttackerStance: return 904;
            case CompanionCommand.DefenderStance: return 903;
            case CompanionCommand.HealerStance: return 905;
        }
    }
    onCompanionStateUpdated(state) {
        if (!state) {
            this.showPanel = false;
            this.companion = null;
            this.xpPercent = 0;
            return;
        }
        this.companion = state;
        this.xpPercent = Math.round((state.currentXP / state.maxXP) * 100);
    }
    useGrysahlGreens() {
        if (this.summoning) {
            return;
        }
        this.summoning = true;
        this.invoker.companion.summon();
        setTimeout(() => this.summoning = false, 2000);
    }
    secondsToMMSS(seconds) {
        seconds = Math.floor(seconds);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds - (minutes * 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    secondsToMinutes(seconds) {
        return Math.floor(seconds / 60);
    }
    get minutesToAdd() {
        return this.secondsToMinutes(Math.min(1800, 3600 - this.companion.timeLeft));
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
    __metadata("design:paramtypes", [CompanionState]),
    __metadata("design:returntype", void 0)
], LuxToolbarGearset.prototype, "onCompanionStateUpdated", null);
LuxToolbarGearset = __decorate([
    UIComponent('lux-toolbar-companion', '/css/toolbar/lux-toolbar-companion.css')
], LuxToolbarGearset);
export { LuxToolbarGearset };
//# sourceMappingURL=LuxToolbarCompanion.js.map
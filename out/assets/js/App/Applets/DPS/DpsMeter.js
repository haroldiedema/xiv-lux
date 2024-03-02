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
import { AbstractApplet, Applet } from "@/System/Applet";
import { Inject } from "@/System/Interface";
import { ActorManager } from "@/XIV/ActorManager";
import { EncounterParser } from "@/XIV/Encounter/EncounterParser";
let DpsMeter = class DpsMeter extends AbstractApplet {
    constructor() {
        super(...arguments);
        this.eventSubscriber = null;
        this.participants = [];
        this.totalParticipants = 0;
        this.totalDamage = 0;
        this.yourPosition = 0;
    }
    /**
     * @inheritdoc
     */
    onMounted() {
        this.eventSubscriber = this.ep.on('updated', p => {
            this.totalParticipants = p.length;
            this.participants = p.slice(0, 8);
            this.yourPosition = p.find(p => p.actor.id === this.actors.player.id)?.position ?? 0;
            this.totalDamage = p.reduce((a, b) => a + b.totalDamage, 0);
        });
    }
    onDisposed() {
        this.eventSubscriber.unsubscribe();
    }
    /**
     * @inheritdoc
     */
    render() {
        if (this.participants.length === 0) {
            return (_jsx("ui:host", { children: _jsx("main", { "ui-key": "inactive", children: _jsx("div", { children: "No encounter data available." }) }) }));
        }
        return (_jsx("ui:host", { children: _jsxs("main", { "ui-key": "active", children: [this.participants.map((p) => (_jsxs("div", { class: "participant", children: [_jsx("div", { class: "background", style: { width: p.percentage + '%' } }), _jsxs("div", { class: "foreground", children: [_jsxs("div", { class: "name", children: [_jsx("xiv-icon", { icon: 62000 + p.actor.jobId, size: 24 }), "#", p.position, " ", p.actor.name] }), _jsxs("div", { class: "dps", children: [_jsxs("div", { children: [_jsx("div", { children: p.dps.toLocaleString('nl') }), _jsx("div", { children: p.totalDamage.toLocaleString('nl') })] }), _jsxs("div", { children: [p.percentage, "%"] })] })] })] }))), _jsxs("footer", { children: ["You are ranked #", this.yourPosition, " out of ", this.totalParticipants, ". Total damage: ", this.totalDamage.toLocaleString('nl')] })] }) }));
    }
};
__decorate([
    Inject,
    __metadata("design:type", EncounterParser)
], DpsMeter.prototype, "ep", void 0);
__decorate([
    Inject,
    __metadata("design:type", ActorManager)
], DpsMeter.prototype, "actors", void 0);
DpsMeter = __decorate([
    Applet('xiv-dps-meter', {
        name: 'DPS Meter',
        icon: 'chart-line',
        styleUrl: '/css/applets/xiv-dps-meter.css',
        isSingleInstance: true,
        isFrameless: true,
        minWidth: 300,
        minHeight: 250,
    })
], DpsMeter);
export { DpsMeter };
//# sourceMappingURL=DpsMeter.js.map
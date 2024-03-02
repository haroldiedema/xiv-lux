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
import { EventEmitter } from "@/System/Event";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { ActorManager } from "@/XIV/ActorManager";
import { EncounterParticipant } from "@/XIV/Encounter/EncounterParticipant";
import { LineParser } from "@/XIV/Encounter/LineParser";
import { PlayerActor } from "@/XIV/Models";
let EncounterParser = class EncounterParser extends EventEmitter {
    constructor() {
        super();
        this.tokenBuffer = [];
        this.totalDamage = 0;
        this.participants = new Map();
        this.lastUpdatedAt = 0;
        this.socket.on('Chat', this.onChatLine);
        this.onTick();
    }
    onTick() {
        setTimeout(() => this.onTick(), 1000);
        const damageMap = new Map();
        while (this.tokenBuffer.length > 0) {
            const token = this.tokenBuffer.shift();
            switch (token.type) {
                case 'AutoAttack':
                    if (token.source instanceof PlayerActor) {
                        const damage = damageMap.get(token.source.id) || 0;
                        damageMap.set(token.source.id, damage + token.damage);
                    }
                    break;
                case 'DamageTaken':
                    if (token.source instanceof PlayerActor) {
                        const damage = damageMap.get(token.source.id) || 0;
                        damageMap.set(token.source.id, damage + token.damage);
                    }
                    break;
            }
        }
        if (damageMap.size === 0 && this.totalDamage > 0) {
            if (this.lastUpdatedAt < Date.now() - 5000) {
                this.participants.clear();
                this.totalDamage = 0;
                this.dispatch('updated', []);
            }
            return;
        }
        this.lastUpdatedAt = Date.now();
        for (const [id, damage] of damageMap) {
            if (!this.participants.has(id)) {
                const actor = this.actors.getPlayerById(id);
                if (!actor) {
                    continue;
                }
                this.participants.set(id, new EncounterParticipant(actor));
            }
            const participant = this.participants.get(id);
            participant.addDps(damage);
            this.totalDamage += damage;
        }
        // Test if participants should be removed.
        for (const id of this.participants.keys()) {
            if (!this.actors.getPlayerById(id)) {
                this.participants.delete(id);
            }
        }
        // Update the percentage of the total damage done for each participant.
        for (const participant of this.participants.values()) {
            participant.setPercentage((participant.totalDamage / this.totalDamage) * 100);
        }
        // Update the position of the participants based on their total damage done.
        const sorted = Array.from(this.participants.values()).sort((a, b) => b.totalDamage - a.totalDamage);
        for (let i = 0; i < sorted.length; i++) {
            sorted[i].setPosition(i + 1);
        }
        this.dispatch('updated', sorted);
    }
    onChatLine(lines) {
        for (const line of lines) {
            if (line.opcode < 2000)
                continue;
            this.parseLine(line);
        }
    }
    parseLine(line) {
        const message = line.message.replace(/[^\x00-\x7F]/g, '');
        const payload = this.parser.parse(message);
        if (null !== payload && payload.source instanceof PlayerActor) {
            this.tokenBuffer.push(payload);
        }
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], EncounterParser.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", LineParser)
], EncounterParser.prototype, "parser", void 0);
__decorate([
    Inject,
    __metadata("design:type", ActorManager)
], EncounterParser.prototype, "actors", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], EncounterParser.prototype, "onChatLine", null);
EncounterParser = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], EncounterParser);
export { EncounterParser };
//# sourceMappingURL=EncounterParser.js.map
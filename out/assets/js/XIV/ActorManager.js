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
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { GameState } from "@/XIV/Models/Generated";
let ActorManager = class ActorManager {
    constructor() {
        this.playerActors = new Map();
        this.npcActors = new Map();
        this.gatheringNodeActors = new Map();
        this.localPlayerId = null;
        this.socket.on('PlayerActors', this.onPlayerActorsUpdated.bind(this));
        this.socket.on('NpcActors', this.onNpcActorsUpdated.bind(this));
        this.socket.on('GatheringNodeActors', this.onGatheringNodeActorsUpdated.bind(this));
        this.socket.on('GameState', this.onGameStateUpdated.bind(this));
    }
    get player() {
        return this.playerActors.get(this.localPlayerId);
    }
    get players() {
        return Array.from(this.playerActors.values()).filter((actor) => actor.id !== this.localPlayerId);
    }
    get allPlayers() {
        return Array.from(this.playerActors.values());
    }
    getPlayerById(id) {
        return this.playerActors.get(id);
    }
    get npcs() {
        return Array.from(this.npcActors.values());
    }
    get gatheringNodes() {
        return Array.from(this.gatheringNodeActors.values());
    }
    onPlayerActorsUpdated(actors) {
        this.playerActors.clear();
        for (const actor of actors) {
            this.playerActors.set(actor.id, actor);
        }
        this.updateTargetReferences();
    }
    onNpcActorsUpdated(actors) {
        this.npcActors.clear();
        for (const actor of actors) {
            this.npcActors.set(actor.id, actor);
        }
        this.updateTargetReferences();
    }
    onGatheringNodeActorsUpdated(actors) {
        this.gatheringNodeActors.clear();
        for (const actor of actors) {
            this.gatheringNodeActors.set(actor.id, actor);
        }
        this.updateTargetReferences();
    }
    onGameStateUpdated(gameState) {
        this.localPlayerId = gameState.playerId;
    }
    updateTargetReferences() {
        this.playerActors.forEach((actor) => {
            if (actor.targetId) {
                actor.target = this.playerActors.get(actor.targetId) || this.npcActors.get(actor.targetId) || this.gatheringNodeActors.get(actor.targetId) || null;
            }
        });
        this.npcActors.forEach((actor) => {
            if (actor.targetId) {
                actor.target = this.playerActors.get(actor.targetId) || this.npcActors.get(actor.targetId) || null;
            }
        });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], ActorManager.prototype, "socket", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ActorManager.prototype, "onPlayerActorsUpdated", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ActorManager.prototype, "onNpcActorsUpdated", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ActorManager.prototype, "onGatheringNodeActorsUpdated", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GameState]),
    __metadata("design:returntype", void 0)
], ActorManager.prototype, "onGameStateUpdated", null);
ActorManager = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], ActorManager);
export { ActorManager };
//# sourceMappingURL=ActorManager.js.map
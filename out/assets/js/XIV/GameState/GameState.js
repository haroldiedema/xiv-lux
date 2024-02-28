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
import * as Model from "@/XIV/Models/Generated";
let GameState = class GameState extends EventEmitter {
    constructor() {
        super();
        this._isLoggedIn = false;
        this._isOccupied = false;
        this._isInCombat = false;
        this._inCutscene = false;
        this._playerId = null;
        this._zoneId = null;
        this.socket.on('GameState', this.onGameStateUpdated);
    }
    get isLoggedIn() { return this._isLoggedIn; }
    get isOccupied() { return this._isOccupied; }
    get isInCombat() { return this._isInCombat; }
    get inCutscene() { return this._inCutscene; }
    get playerId() { return this._playerId; }
    get zoneId() { return this._zoneId; }
    /**
     * Invoked when the game state is updated.
     */
    onGameStateUpdated(gs) {
        if (gs.zoneId !== this._zoneId) {
            this._zoneId = gs.zoneId;
            this.dispatch('zone-changed', this._zoneId);
        }
        if (gs.playerId !== this._playerId) {
            this._playerId = gs.playerId;
            this.dispatch('player-changed', this._playerId);
        }
        if (gs.isOccupied !== this._isOccupied) {
            this._isOccupied = gs.isOccupied;
            this.dispatch(this._isOccupied ? 'occupied' : 'idle');
        }
        if (gs.isInCombat !== this._isInCombat) {
            this._isInCombat = gs.isInCombat;
            this.dispatch(this._isInCombat ? 'combat-start' : 'combat-end');
        }
        if (gs.isInCutscene !== this._inCutscene) {
            this._inCutscene = gs.isInCutscene;
            this.dispatch(this._inCutscene ? 'cutscene-start' : 'cutscene-end');
        }
        if (gs.isLoggedIn !== this._isLoggedIn) {
            this._isLoggedIn = gs.isLoggedIn;
            this.dispatch(this._isLoggedIn ? 'login' : 'logout');
        }
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], GameState.prototype, "socket", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Model.GameState]),
    __metadata("design:returntype", void 0)
], GameState.prototype, "onGameStateUpdated", null);
GameState = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], GameState);
export { GameState };
//# sourceMappingURL=GameState.js.map
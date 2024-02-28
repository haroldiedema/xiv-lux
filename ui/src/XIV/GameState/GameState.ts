/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventEmitter } from "@/System/Event";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { GameStateEvents } from "@/XIV/GameState/GameStateEvents";
import * as Model from "@/XIV/Models/Generated";

@Service()
export class GameState extends EventEmitter<GameStateEvents>
{
    @Inject private readonly socket: Socket;

    private _isLoggedIn: boolean = false;
    private _isOccupied: boolean = false;
    private _isInCombat: boolean = false;
    private _inCutscene: boolean = false;
    private _playerId: string = null;
    private _zoneId: number = null;

    constructor()
    {
        super();

        this.socket.on('GameState', this.onGameStateUpdated);
    }

    public get isLoggedIn(): boolean { return this._isLoggedIn; }
    public get isOccupied(): boolean { return this._isOccupied; }
    public get isInCombat(): boolean { return this._isInCombat; }
    public get inCutscene(): boolean { return this._inCutscene; }
    public get playerId(): string { return this._playerId; }
    public get zoneId(): number { return this._zoneId; }

    /**
     * Invoked when the game state is updated.
     */
    @Bound private onGameStateUpdated(gs: Model.GameState)
    {
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
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { PlayerActor } from "@/XIV/Models";

export class EncounterParticipant
{
    private _totalDamage: number = 0;
    private _damageTicks: number[] = [];
    private _position: number = null;
    private _percentage: number = 0;

    public constructor(public readonly actor: PlayerActor)
    {
    }

    public addDps(damage: number): void
    {
        this._totalDamage += damage;
        this._damageTicks.push(damage);
    }

    public setPercentage(percentage: number): void
    {
        this._percentage = percentage;
    }

    public setPosition(position: number): void
    {
        this._position = position;
    }

    public get position(): number
    {
        return this._position;
    }

    public get percentage(): number
    {
        return Math.round(this._percentage);
    }

    public get totalDamage(): number
    {
        return this._totalDamage;
    }

    public get dps(): number
    {
        return Math.round(this._totalDamage / this._damageTicks.length);
    }
}
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class EncounterParticipant {
    constructor(actor) {
        this.actor = actor;
        this._totalDamage = 0;
        this._damageTicks = [];
        this._position = null;
        this._percentage = 0;
    }
    addDps(damage) {
        this._totalDamage += damage;
        this._damageTicks.push(damage);
    }
    setPercentage(percentage) {
        this._percentage = percentage;
    }
    setPosition(position) {
        this._position = position;
    }
    get position() {
        return this._position;
    }
    get percentage() {
        return Math.round(this._percentage);
    }
    get totalDamage() {
        return this._totalDamage;
    }
    get dps() {
        return Math.round(this._totalDamage / this._damageTicks.length);
    }
}
//# sourceMappingURL=EncounterParticipant.js.map
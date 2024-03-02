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
import { ActorManager } from "@/XIV/ActorManager";
import { NameSanitizer } from "@/XIV/Encounter/NameSanitizer";
// Add a group name to each regex to make it easier to identify which regex matched.
const SOURCE_REGEX = '(?<source>[A-Z\'][A-Za-z-\'`]+(\\s[A-Za-z-\'`]+)?)';
const TARGET_REGEX = '(?<target>[A-Z\'][A-Za-z-\'`]+(\\s[A-Za-z-\'`]+)?)';
const ACTION_REGEX = '(?<action>[A-Z][A-Za-z0-9\\s\'`:()-]+)';
const POWER_PREFIX = '(Direct hit!|Critical!|Critical direct hit!)?\\s?';
const DAMAGE_REGEX = `(?<damage>\\d+)(\\([0-9-+%]+\\))?\\sdamage`;
const HEALED_REGEX = `(?<healed>\\d+)(\\([0-9-+%]+\\))?\\sHP`;
let LineParser = class LineParser {
    constructor() {
        this.tokenTypes = [
            { type: 'ReadyAction', regex: `${SOURCE_REGEX} (ready|readies) ${ACTION_REGEX}\\.` },
            { type: 'UseAction', regex: `${SOURCE_REGEX} (use|uses|mount|mounts) ${ACTION_REGEX}\\.` },
            { type: 'CastAction', regex: `${SOURCE_REGEX} (cast|casts) ${ACTION_REGEX}\\.` },
            { type: 'GainEffect', regex: `${SOURCE_REGEX} (gain|gains) effect of ${ACTION_REGEX}\\.` },
            { type: 'LoseEffect', regex: `${SOURCE_REGEX} (lose|loses|recovers from|recover from) effect of ${ACTION_REGEX}\\.` },
            { type: 'SufferEffect', regex: `${SOURCE_REGEX} (suffer|suffers) effect of ${ACTION_REGEX}\\.` },
            { type: 'AutoAttack', regex: `${POWER_PREFIX}${SOURCE_REGEX} (hit|hits) ${TARGET_REGEX} for ${DAMAGE_REGEX}\\.` },
            { type: 'DamageTaken', regex: `${POWER_PREFIX}${TARGET_REGEX} (take|takes|suffer|suffers) ${DAMAGE_REGEX}\\.` },
            { type: 'HpRecovered', regex: `${SOURCE_REGEX} (recover|recovers) ${HEALED_REGEX}\\.` },
        ];
        this.lastCastSourceActor = null;
    }
    parse(str) {
        if (!this.actors.player) {
            return null;
        }
        if (str.toLowerCase().includes(' the ')) {
            str = str.replaceAll(/\sthe\s/ig, ' ');
        }
        if (str.toLowerCase().includes('you')) {
            str = str.replaceAll(/\syou\s/ig, ` ${this.actors.player.name} `);
            str = str.replaceAll(/^you\s/ig, `${this.actors.player.name} `);
        }
        // Count the number of spaces before the message to indicate a "depth".
        const depth = str.match(/^\s*/)[0].length;
        for (const type of this.tokenTypes) {
            const matches = new RegExp(type.regex, 'ig').exec(str);
            if (matches) {
                const token = { depth: depth, type: type.type };
                if (matches.groups?.source) {
                    const name = this.sanitizer.sanitize(matches.groups.source).toLowerCase();
                    token.source =
                        this.actors.allPlayers.find((actor) => actor.name.toLowerCase() === name) ||
                            this.actors.npcs.find((actor) => actor.name.toLowerCase() === name);
                    if (!token.source) {
                        continue;
                    }
                }
                if (matches.groups?.target) {
                    const name = this.sanitizer.sanitize(matches.groups.target).toLowerCase();
                    token.target =
                        this.actors.allPlayers.find((actor) => actor.name.toLowerCase() === name) ||
                            this.actors.npcs.find((actor) => actor.name.toLowerCase() === name);
                    if (!token.target) {
                        continue;
                    }
                }
                if (matches.groups?.action) {
                    token.action = matches.groups.action;
                }
                if (matches.groups?.damage) {
                    token.damage = parseInt(matches.groups.damage);
                    token.damage = isNaN(token.damage) ? 0 : token.damage;
                }
                if (matches.groups?.healed) {
                    token.healed = parseInt(matches.groups.healed);
                    token.healed = isNaN(token.healed) ? 0 : token.healed;
                }
                if (depth === 0 && !!token.source && (type.type === 'CastAction' || type.type === 'UseAction')) {
                    this.lastCastSourceActor = token.source;
                }
                if (depth === 1 && token.type === 'DamageTaken' && !!this.lastCastSourceActor) {
                    token.source = this.lastCastSourceActor;
                }
                return token;
            }
        }
        console.log('Unprocessed:', str);
        return null;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ActorManager)
], LineParser.prototype, "actors", void 0);
__decorate([
    Inject,
    __metadata("design:type", NameSanitizer)
], LineParser.prototype, "sanitizer", void 0);
LineParser = __decorate([
    Service()
], LineParser);
export { LineParser };
//# sourceMappingURL=LineParser.js.map
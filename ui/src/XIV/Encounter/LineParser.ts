/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Inject, Service } from "@/System/Services";
import { ActorManager } from "@/XIV/ActorManager";
import { NameSanitizer } from "@/XIV/Encounter/NameSanitizer";
import { NpcActor, PlayerActor } from "@/XIV/Models";

// Add a group name to each regex to make it easier to identify which regex matched.
const SOURCE_REGEX = '(?<source>[A-Z\'][A-Za-z-\'`]+(\\s[A-Za-z-\'`]+)?)';
const TARGET_REGEX = '(?<target>[A-Z\'][A-Za-z-\'`]+(\\s[A-Za-z-\'`]+)?)';
const ACTION_REGEX = '(?<action>[A-Z][A-Za-z0-9\\s\'`:()-]+)';
const POWER_PREFIX = '(Direct hit!|Critical!|Critical direct hit!)?\\s?';
const DAMAGE_REGEX = `(?<damage>\\d+)(\\([0-9-+%]+\\))?\\sdamage`;
const HEALED_REGEX = `(?<healed>\\d+)(\\([0-9-+%]+\\))?\\sHP`;

export type ReadyActionToken = { type: 'ReadyAction', source: PlayerActor | NpcActor, action: string; };
export type UseActionToken = { type: 'UseAction', source: PlayerActor | NpcActor, action: string; };
export type CastActionToken = { type: 'CastAction', source: PlayerActor | NpcActor, action: string; };
export type GainEffectToken = { type: 'GainEffect', source: PlayerActor | NpcActor, action: string; };
export type LoseEffectToken = { type: 'LoseEffect', source: PlayerActor | NpcActor, action: string; };
export type SufferEffectToken = { type: 'SufferEffect', source: PlayerActor | NpcActor, action: string; };
export type AutoAttackToken = { type: 'AutoAttack', source: PlayerActor | NpcActor, target: PlayerActor | NpcActor, damage: number; };
export type DamageTakenToken = { type: 'DamageTaken', source: PlayerActor | NpcActor, target: PlayerActor | NpcActor, damage: number; };
export type HpRecoveredToken = { type: 'HpRecovered', source: PlayerActor | NpcActor, healed: number; };

export type Token = { depth: number; } & (
    ReadyActionToken | UseActionToken | CastActionToken | GainEffectToken | LoseEffectToken | AutoAttackToken | DamageTakenToken | HpRecoveredToken
);

type TokenType = {
    type: string;
    regex: string;
};

@Service()
export class LineParser
{
    @Inject private readonly actors: ActorManager;
    @Inject private readonly sanitizer: NameSanitizer;

    private readonly tokenTypes: TokenType[] = [
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

    private lastCastSourceActor: PlayerActor | NpcActor = null;

    public parse(str: string): Token
    {
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
                const token = { depth: depth, type: type.type } as any;

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
}

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
import { ActorManager } from "@/XIV/ActorManager";
import { EncounterParticipant } from "@/XIV/Encounter/EncounterParticipant";
import { LineParser, Token } from "@/XIV/Encounter/LineParser";
import { PlayerActor } from "@/XIV/Models";
import { ChatLine } from "@/XIV/Models/Generated";

type EncounterParserEvents = {
    updated: EncounterParticipant[];
};

@Service()
export class EncounterParser extends EventEmitter<EncounterParserEvents>
{
    @Inject private readonly socket: Socket;
    @Inject private readonly parser: LineParser;
    @Inject private readonly actors: ActorManager;

    private tokenBuffer: Token[] = [];
    private totalDamage: number = 0;
    private participants: Map<string, EncounterParticipant> = new Map();
    private lastUpdatedAt: number = 0;

    constructor()
    {
        super();

        this.socket.on('Chat', this.onChatLine);
        this.onTick();
    }

    private onTick(): void
    {
        setTimeout(() => this.onTick(), 1000);

        const damageMap = new Map<string, number>();

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

    @Bound private onChatLine(lines: ChatLine[]): void
    {
        for (const line of lines) {
            if (line.opcode < 2000) continue;

            this.parseLine(line);
        }
    }

    private parseLine(line: ChatLine): void
    {
        const message = line.message.replace(/[^\x00-\x7F]/g, '');
        const payload = this.parser.parse(message);

        if (null !== payload && payload.source instanceof PlayerActor) {
            this.tokenBuffer.push(payload);
        }
    }
}

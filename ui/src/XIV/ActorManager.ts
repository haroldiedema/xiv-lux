/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { NpcActor, GatheringNodeActor, PlayerActor } from "@/XIV/Models";
import { GameState } from "@/XIV/Models/Generated";

@Service()
export class ActorManager
{
    @Inject private readonly socket: Socket;

    private readonly playerActors: Map<string, PlayerActor> = new Map();
    private readonly npcActors: Map<string, NpcActor> = new Map();
    private readonly gatheringNodeActors: Map<string, GatheringNodeActor> = new Map();
    private localPlayerId: string = null;

    constructor()
    {
        this.socket.on('PlayerActors', this.onPlayerActorsUpdated.bind(this));
        this.socket.on('NpcActors', this.onNpcActorsUpdated.bind(this));
        this.socket.on('GatheringNodeActors', this.onGatheringNodeActorsUpdated.bind(this));
        this.socket.on('GameState', this.onGameStateUpdated.bind(this));
    }

    public get player(): PlayerActor | null
    {
        return this.playerActors.get(this.localPlayerId);
    }

    public get players(): PlayerActor[]
    {
        return Array.from(this.playerActors.values()).filter((actor) => actor.id !== this.localPlayerId);
    }

    public get allPlayers(): PlayerActor[]
    {
        return Array.from(this.playerActors.values());
    }

    public getPlayerById(id: string): PlayerActor
    {
        return this.playerActors.get(id);
    }

    public get npcs(): NpcActor[]
    {
        return Array.from(this.npcActors.values());
    }

    public get gatheringNodes(): GatheringNodeActor[]
    {
        return Array.from(this.gatheringNodeActors.values());
    }

    @Bound private onPlayerActorsUpdated(actors: PlayerActor[]): void
    {
        this.playerActors.clear();

        for (const actor of actors) {
            this.playerActors.set(actor.id, actor);
        }

        this.updateTargetReferences();
    }

    @Bound private onNpcActorsUpdated(actors: NpcActor[]): void
    {
        this.npcActors.clear();

        for (const actor of actors) {
            this.npcActors.set(actor.id, actor);
        }

        this.updateTargetReferences();
    }

    @Bound private onGatheringNodeActorsUpdated(actors: GatheringNodeActor[]): void
    {
        this.gatheringNodeActors.clear();

        for (const actor of actors) {
            this.gatheringNodeActors.set(actor.id, actor);
        }

        this.updateTargetReferences();
    }

    @Bound private onGameStateUpdated(gameState: GameState): void
    {
        this.localPlayerId = gameState.playerId;
    }

    private updateTargetReferences(): void
    {
        this.playerActors.forEach((actor) =>
        {
            if (actor.targetId) {
                actor.target = this.playerActors.get(actor.targetId) || this.npcActors.get(actor.targetId) || this.gatheringNodeActors.get(actor.targetId) || null;
            }
        });

        this.npcActors.forEach((actor) =>
        {
            if (actor.targetId) {
                actor.target = this.playerActors.get(actor.targetId) || this.npcActors.get(actor.targetId) || null;
            }
        });
    }
}

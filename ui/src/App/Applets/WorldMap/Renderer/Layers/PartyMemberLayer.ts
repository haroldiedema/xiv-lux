/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Service } from "@/System/Services";
import { PlayerActor } from "@/XIV/Models";

@Service({ tags: ['world-map.layer'] })
export class PartyMemberLayer extends AbstractLayer
{
    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 350;
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.isCurrentZone) {
            return;
        }

        this.players.forEach((player) => this.drawPlayer(player));
    }

    private drawPlayer(player: PlayerActor): void
    {
        if (!player.isPartyMember && !player.isAllianceMember) {
            return;
        }

        if (player.isAllianceMember) {
            this.canvas.drawIcon(60358, player.position, {
                size: 32,
                rotation: player.heading,
            });

            return;
        }

        const iconId = player.jobId + 62000;


        this.canvas.drawViewCone(player.position.x, player.position.y, player.heading, {
            width: Math.PI / 4,
            length: 32,
            color: [255, 255, 255],
        });

        this.canvas.drawIcon(iconId, player.position, {
            size: 32,
            autoScale: true,
            minScale: 16,
            maxScale: 24,
        });
    }
}

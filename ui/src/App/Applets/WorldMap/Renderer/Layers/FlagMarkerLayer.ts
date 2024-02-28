/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { FlagMarker } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class FlagMarkerLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private flagMarker: FlagMarker;

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 65536;
        this.socket.subscribe('FlagMarker', marker => this.flagMarker = marker);
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.zone || this.mapContext.zone.id !== this.flagMarker?.mapId || this.mapContext.zone.territoryId !== this.flagMarker?.territoryId) {
            return;
        }

        this.canvas.drawIcon(this.flagMarker.iconId, this.flagMarker.position, {
            size: 32,
            frustumCulled: true
        });

        if (!this.mapContext.isCurrentZone) {
            return;
        }

        const intersection = this.canvas.findIntersection(this.player.position, this.flagMarker.position, true);
        if (!intersection) {
            return;
        }

        // Draw a line from the flag to the player.
        this.canvas.drawLine(
            this.flagMarker.position.x,
            this.flagMarker.position.y,
            this.player.position.x,
            this.player.position.y,
            {
                stroke: 'rgba(200, 77, 77, 0.66)',
                strokeWidth: 3,
                strokeDash: [6, 9],
                dashOffset: this.elapsedTime * 0.05,
            }
        );

        const playerPos = this.canvas.translate(this.player.position);
        const direction = intersection.subtract(playerPos).normalize().multiplyScalar(32);
        const textPos = intersection.subtract(direction);
        const distance = this.player.position.toWorldCoordinates(this.mapContext.zone).distanceTo(this.flagMarker.position.toWorldCoordinates(this.mapContext.zone));
        const textOpts = {
            font: 'monospace',
            size: 13,
            color: '#ffb0a0',
            shadow: true,
            outline: true,
            noTranslate: true,
            align: 'center' as CanvasTextAlign,
        };

        this.canvas.drawText(`Flag`, textPos.x, textPos.y, { ...textOpts, size: 12 });
        this.canvas.drawText(`${Math.round(distance)}y`, textPos.x, textPos.y + 13, textOpts);
    }
}

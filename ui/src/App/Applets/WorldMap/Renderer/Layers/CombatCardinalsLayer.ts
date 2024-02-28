/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { GameState } from "@/XIV/GameState";
import { NpcActor } from "@/XIV/Models";

@Service({ tags: ['world-map.layer'] })
export class CombatCardinalsLayer extends AbstractLayer
{
    @Inject private readonly gameState: GameState;

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 65535;
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.isCurrentZone || !this.gameState.isInCombat || !this.player.target || this.hasCustomCameraOffset) {
            return;
        }

        const target = this.player.target;
        if (!(target instanceof NpcActor) || !target.isInCombat) {
            return;
        }
        
        const x = this.player.target.position.x;
        const y = this.player.target.position.y;
        const w = (this.viewportSize.width / 2) / this.zoom;
        const h = (this.viewportSize.height / 2) / this.zoom;

        this.canvas.drawLine(x - w, y, x + w, y, { stroke: 'rgba(255, 0, 0, .15)', strokeWidth: 1 });
        this.canvas.drawLine(x, y - h, x, y + h, { stroke: 'rgba(255, 0, 0, .15)', strokeWidth: 1 });

        this.canvas.drawText('NW', x - (w / 2), y - (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
        this.canvas.drawText('NE', x + (w / 2), y - (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
        this.canvas.drawText('SW', x - (w / 2), y + (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
        this.canvas.drawText('SE', x + (w / 2), y + (h / 2), { font: 'Impact', size: 64, color: 'rgba(255, 0, 0, .15)' });
    }
}

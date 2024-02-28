/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Service } from "@/System/Services";
import { GatheringNodeActor } from "@/XIV/Models";

@Service({ tags: ['world-map.layer'] })
export class GatheringNodesLayer extends AbstractLayer
{
    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 100;
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.zone || !this.mapContext.isCurrentZone) {
            return;
        }

        this.gatheringNodes.forEach(node => this.drawNode(node));
    }

    private drawNode(node: GatheringNodeActor): void
    {
        if (!node.isTargetable) {
            return;
        }

        const p1 = this.canvas.translate(this.player.position);
        const p2 = this.canvas.translate(node.position);
        const is = this.canvas.findIntersection(p1, p2);

        if (is) {
            this.canvas.drawLine(p1.x, p1.y, is.x, is.y, {
                noTranslate: true,
                stroke: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 3,
                strokeDash: [5, 5],
                dashOffset: this.elapsedTime / 50,
            });
            this.canvas.drawLine(p1.x, p1.y, is.x, is.y, {
                noTranslate: true,
                stroke: 'rgba(255, 255, 196, 0.5)',
                strokeWidth: 2,
                strokeDash: [5, 5],
                dashOffset: this.elapsedTime / 50,
            });


        }

        this.canvas.drawIcon(node.iconId, node.position, {
            size: 32,
        });
    }
}

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
import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Service } from "@/System/Services";
let PartyMemberLayer = class PartyMemberLayer extends AbstractLayer {
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 350;
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.isCurrentZone) {
            return;
        }
        this.players.forEach((player) => this.drawPlayer(player));
    }
    drawPlayer(player) {
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
};
PartyMemberLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], PartyMemberLayer);
export { PartyMemberLayer };
//# sourceMappingURL=PartyMemberLayer.js.map
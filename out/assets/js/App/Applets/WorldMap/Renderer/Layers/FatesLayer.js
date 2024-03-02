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
import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { FateStateKind } from "@/XIV/Models/Generated";
let FatesLayer = class FatesLayer extends AbstractLayer {
    constructor() {
        super(...arguments);
        this.fates = [];
    }
    /**
     * @inheritdoc
     */
    init() {
        this.renderOrder = 50;
        this.socket.on('Fates', markers => this.fates = markers);
    }
    /**
     * @inheritDoc
     */
    draw() {
        if (!this.mapContext.zone) {
            return;
        }
        this.fates.forEach((marker) => this.drawMarker(marker));
    }
    drawMarker(marker) {
        if (marker.state === FateStateKind.Unknown || marker.state === FateStateKind.Ended || marker.state === FateStateKind.Disposing) {
            return;
        }
        const pos = this.canvas.translate(marker.position).mut();
        const col = this.getColor(marker);
        if (null !== col && marker.state !== FateStateKind.Preparation) {
            this.canvas.drawArc(marker.position.x, marker.position.y, {
                radius: marker.radius * this.zoom,
                fill: this.createGradient(pos, marker.radius, col),
                stroke: `rgba(${col[0]}, ${col[1]}, ${col[2]}, .5)`,
                strokeWidth: 2,
                strokeDash: [5, 5],
                dashOffset: -this.elapsedTime / 50,
            });
        }
        this.addRaycasterCandidate(marker.name, marker.position, { width: 32, height: 32 });
        this.canvas.drawIcon(marker.iconId, marker.position, {
            frustumCulled: true,
            filter: marker.state === FateStateKind.Preparation ? 'grayscale(100%)' : undefined,
        });
        if (this.isRaycasterHit(marker.name)) {
            this.canvas.drawText(marker.name, marker.position.x, marker.position.y - (24 / this.zoom), {
                size: 13,
                color: `#fff`,
                outline: true,
                shadow: true,
            });
        }
        else if (marker.progress > 0) {
            this.canvas.drawText(`${marker.progress}%`, marker.position.x, marker.position.y - (22 / this.zoom), {
                size: 13,
                color: `#fff`,
                outline: true,
                shadow: true,
            });
        }
        if (marker.state !== FateStateKind.Preparation) {
            this.canvas.drawText(this.secondsToTimeString(this.getTimeRemaining(marker)), marker.position.x, marker.position.y + (24 / this.zoom), {
                size: 11,
                color: `#fff`,
                outline: true,
                shadow: true,
            });
        }
    }
    getTimeRemaining(marker) {
        return marker.duration - ((Date.now() / 1000) - marker.startTimeEpoch);
    }
    secondsToTimeString(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    getColor(marker) {
        switch (marker.state) {
            case FateStateKind.Preparation:
            case FateStateKind.Disposing:
            case FateStateKind.Ended:
                return null;
            case FateStateKind.Running:
                if (this.getTimeRemaining(marker) < 300) {
                    return [255, 96, 96];
                }
                return [200, 96, 255];
            case FateStateKind.WaitingForEnd:
                return [96, 255, 180];
            case FateStateKind.Failed:
                return [255, 96, 96];
        }
        console.warn(`Unknown fate state: ${marker.state}`, marker);
        return null;
    }
    createGradient(pos, radius, color) {
        const gradient = this.canvas.context.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * this.zoom);
        gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
        gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, .5)`);
        return gradient;
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], FatesLayer.prototype, "socket", void 0);
FatesLayer = __decorate([
    Service({ tags: ['world-map.layer'] })
], FatesLayer);
export { FatesLayer };
//# sourceMappingURL=FatesLayer.js.map
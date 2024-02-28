/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractLayer } from "@/App/Applets/WorldMap/Renderer/Layers/AbstractLayer";
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Vec2 } from "@/XIV/Models";
import { FateMarker, FateStateKind } from "@/XIV/Models/Generated";

@Service({ tags: ['world-map.layer'] })
export class FatesLayer extends AbstractLayer
{
    @Inject private readonly socket: Socket;

    private fates: FateMarker[] = [];

    /**
     * @inheritdoc
     */
    protected init(): void
    {
        this.renderOrder = 50;
        this.socket.on('Fates', markers => this.fates = markers);
    }

    /**
     * @inheritDoc
     */
    protected draw(): void
    {
        if (!this.mapContext.zone) {
            return;
        }

        this.fates.forEach((marker) => this.drawMarker(marker));
    }

    private drawMarker(marker: FateMarker): void
    {
        if (marker.state === FateStateKind.Unknown || marker.state === FateStateKind.Ended || marker.state === FateStateKind.Disposing) {
            return;
        }

        const pos = this.canvas.translate(marker.position).mut();
        const col = this.getColor(marker);

        if (null !== col && marker.state !== FateStateKind.Preparation) {
            this.canvas.drawArc(marker.position.x, marker.position.y, {
                radius: marker.radius,
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
        } else if (marker.progress > 0) {
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

    private getTimeRemaining(marker: FateMarker): number
    {
        return marker.duration - ((Date.now() / 1000) - marker.startTimeEpoch);
    }

    private secondsToTimeString(seconds: number): string
    {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    private getColor(marker: FateMarker): [number, number, number] | null
    {
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

    private createGradient(pos: Vec2, radius: number, color: [number, number, number]): CanvasGradient
    {
        const gradient = this.canvas.context.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);

        gradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
        gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, .5)`);

        return gradient;
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventEmitter, IDisposableEventEmitter } from "@/System/Event";
import { Socket } from "@/System/Socket";
import { GatheringNodeActor, PlayerActor } from "@/XIV/Models/Generated";
import { IconRepository } from "@/XIV/Texture/IconRepository";

export class RadarRenderer extends EventEmitter<IDisposableEventEmitter>
{
    private readonly ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    private readonly observer: ResizeObserver = new ResizeObserver(() => this.onResize());

    private zoomFactor: number = 2;
    private rafHandle: number = null;
    private width: number = 0;
    private height: number = 0;
    private halfWidth: number = 0;
    private halfHeight: number = 0;

    private player: PlayerActor = null;
    private nodes: GatheringNodeActor[] = [];

    constructor(
        private readonly canvas: HTMLCanvasElement,
        socket: Socket
    )
    {
        super();

        socket.subscribe(this, 'PlayerActor', p => this.player = p);
        socket.subscribe(this, 'GatheringNodeActors', n => this.nodes = n);

        this.observer.observe(this.canvas);
        this.onResize();
        this.render();
    }

    public dispose(): void
    {
        this.observer.disconnect();
        cancelAnimationFrame(this.rafHandle);
        this.dispatch('disposed');
    }

    private render()
    {
        this.rafHandle = requestAnimationFrame(() => this.render());

        if (!this.width || !this.player) {
            return;
        }

        this.clear();

        for (var node of this.nodes) {
            if (!node.isTargetable) {
                continue;
            }

            const pX = this.player.position.x * this.zoomFactor;
            const pY = this.player.position.y * this.zoomFactor;
            const nX = node.position.x * this.zoomFactor;
            const nY = node.position.y * this.zoomFactor;
            const x = this.halfWidth + (nX - pX);
            const y = this.halfHeight + (nY - pY);

            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.closePath();
            this.ctx.fill();

            // Draw a line from this position to the center.
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(this.halfWidth, this.halfHeight);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.stroke();
            this.ctx.closePath();

            // Draw icon.
            const icon = IconRepository.getInstance().getCached(node.iconId);
            if (!icon) {
                continue;
            }

            this.ctx.drawImage(icon, x - 16, y - 16, 32, 32);
        }
    }

    private clear(): void
    {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw a crosshair in the middle of the canvas.
        this.ctx.strokeStyle = '#2f2f2f';
        this.ctx.beginPath();
        this.ctx.moveTo(this.halfWidth, 0);
        this.ctx.lineTo(this.halfWidth, this.height);
        this.ctx.moveTo(0, this.halfHeight);
        this.ctx.lineTo(this.width, this.halfHeight);
        this.ctx.stroke();

        // Draw a circle around the player.
        this.ctx.beginPath();
        this.ctx.arc(this.halfWidth, this.halfHeight, 64, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw a FOV cone based on the player rotation.
        const ctx = this.ctx;
        const a = (this.player.heading - Math.PI / 2) - (Math.PI / 4);
        const r = 64;

        const x = this.halfWidth;
        const y = this.halfHeight;

        const tX = x + r * Math.cos(a);
        const tY = y + r * Math.sin(a);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tX, tY);
        ctx.arc(x, y, r, a, a + (Math.PI / 2));
        ctx.lineTo(x, y);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
    }

    private onResize(): void
    {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }
}
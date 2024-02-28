/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";

@Service()
export class IconRepository
{
    private static _instance: IconRepository = null;

    @Inject private readonly socket: Socket;

    private readonly cache: Map<number, HTMLImageElement> = new Map();
    private readonly queue: Set<number> = new Set();
    private readonly tempImage: HTMLImageElement = new Image(8, 8);

    public static getInstance(): IconRepository
    {
        if (!IconRepository._instance) {
            throw new Error('IconRepository has not been initialized.');
        }

        return IconRepository._instance;
    }

    constructor()
    {
        IconRepository._instance = this;
    }

    public get(iconId: number): Promise<HTMLImageElement>
    {
        if (this.cache.has(iconId)) {
            return Promise.resolve(this.cache.get(iconId));
        }

        if (this.queue.has(iconId)) {
            return new Promise((resolve) =>
            {
                const interval = setInterval(() =>
                {
                    if (!this.queue.has(iconId)) {
                        clearInterval(interval);
                        resolve(this.cache.get(iconId));
                    }
                }, 100);
            });
        }

        this.queue.add(iconId);

        return new Promise((resolve) =>
        {
            const img = new Image();
            img.src = `${this.socket.httpAddress}/image/icon/${iconId}.png`;
            img.onload = () =>
            {
                this.cache.set(iconId, img);
                this.queue.delete(iconId);
                resolve(img);
            };
        });
    }

    public getCached(iconId: number): HTMLImageElement
    {
        if (!this.cache.has(iconId)) {
            this.get(iconId); // Cache it.
            return this.tempImage;
        }

        return this.cache.get(iconId);
    }
}
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { EventEmitter, EventSubscriber } from "@/System/Event";
import { ModelFactory } from "@/System/Serializer";
import { Inject, Service } from "@/System/Services";
import { DownstreamPayload, DownstreamPayloadType } from "@/System/Socket/DownstreamPayload";
import { EventStreamType } from "@/System/Socket/EventStreamTypes";
import { RequestQueue } from "@/System/Socket/RequestQueue";

@Service({ initializer: sock => sock.connect() })
export class Socket extends EventEmitter<EventStreamType>
{
    @Inject private readonly modelFactory: ModelFactory;

    private readonly eventCache: Map<keyof EventStreamType, any> = new Map();

    private socket: WebSocket = null;
    private queue: RequestQueue = null;
    private port: number = 51337;

    constructor()
    {
        super();

        (window as any).s = this;
    }

    public async connect(port: number = 51337): Promise<void>
    {
        this.port = port;
        this.socket = new WebSocket(this.socketAddress);
        this.queue = new RequestQueue();

        return new Promise((resolve) =>
        {
            this.socket.onerror = () => setTimeout(() => this.connect(port), 1000);
            this.socket.onopen = () =>
            {
                resolve();

                this.socket.onerror = null;
                this.socket.onopen = null;
                this.socket.onmessage = this.onMessage.bind(this);
                this.socket.onclose = () => setTimeout(() => location.reload(), 500);
            };
        });
    }

    public get httpAddress(): string
    {
        return `http://localhost:${this.port}`;
    }

    public get socketAddress(): string
    {
        return `ws://localhost:${this.port}`;
    }

    public invoke(command: string, args: any[]): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.socket.send(this.queue.enqueue(command, args, resolve, reject));
        });
    }

    public subscribe<T extends EventStreamType, K extends keyof EventStreamType>(
        type: K,
        callback: (data: T[K]) => any
    ): IEventSubscriber;
    public subscribe<T extends EventStreamType, K extends keyof EventStreamType>(
        disposable: DisposableEventEmitterLike,
        type: K,
        callback: (data: EventStreamType[K]) => any
    ): IEventSubscriber;
    public subscribe<T extends EventStreamType, K extends keyof EventStreamType>(
        arg1: K | DisposableEventEmitterLike,
        arg2: ((data: T[K]) => any) | T,
        arg3?: (data: T[K]) => any
    ): IEventSubscriber
    {
        let disposable: DisposableEventEmitterLike | null = null;
        let type: K;
        let callback: ((data: T[K]) => any) | undefined;

        if (typeof arg1 === 'object' && arg1 instanceof EventEmitter) {
            disposable = arg1;
            type = arg2 as any;
            callback = arg3;
        } else {
            type = arg1 as K;
            callback = arg2 as (data: T[K]) => any;
        }

        const subscriber = this.on(type, callback);

        if (this.eventCache.has(type)) {
            callback!(this.eventCache.get(type));
        }

        if (disposable) {
            disposable.once('disposed', () =>
            {
                subscriber.unsubscribe();
            });
        }

        return {
            dispose: () => subscriber.unsubscribe()
        };
    }

    private onMessage(event: MessageEvent): void
    {
        const message = this.parseMessage(event.data);
        if (!message) {
            return;
        }

        switch (message.kind) {
            case DownstreamPayloadType.Event:
                const data = this.modelFactory.deserialize(message.data);
                this.eventCache.set(message.name, data);
                return this.dispatch(message.name, data);
            case DownstreamPayloadType.Response:
                return this.queue.tryDequeue(message.id, this.modelFactory.deserialize(message.value), message.isError);
        }
    }

    private parseMessage(data: string): DownstreamPayload
    {
        try {
            return JSON.parse(data);
        } catch {
            console.error('Failed to parse message:', data);
        }
    }
}

export type IEventSubscriber = {
    dispose(): void;
};

type DisposableEventEmitterLike = {
    on(event: 'disposed', callback: (...args: any[]) => any): EventSubscriber<any>;
    once(event: 'disposed', callback: (...args: any[]) => any): EventSubscriber<any>;
};
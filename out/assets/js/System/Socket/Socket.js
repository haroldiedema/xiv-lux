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
import { EventEmitter } from "@/System/Event";
import { ModelFactory } from "@/System/Serializer";
import { Inject, Service } from "@/System/Services";
import { DownstreamPayloadType } from "@/System/Socket/DownstreamPayload";
import { RequestQueue } from "@/System/Socket/RequestQueue";
let Socket = class Socket extends EventEmitter {
    constructor() {
        super();
        this.eventCache = new Map();
        this.socket = null;
        this.queue = null;
        this.port = 51337;
        window.s = this;
    }
    async connect(port = 51337) {
        this.port = port;
        this.socket = new WebSocket(this.socketAddress);
        this.queue = new RequestQueue();
        return new Promise((resolve) => {
            this.socket.onerror = () => setTimeout(() => this.connect(port), 1000);
            this.socket.onopen = () => {
                resolve();
                this.socket.onerror = null;
                this.socket.onopen = null;
                this.socket.onmessage = this.onMessage.bind(this);
                this.socket.onclose = () => setTimeout(() => location.reload(), 500);
            };
        });
    }
    get httpAddress() {
        return `http://localhost:${this.port}`;
    }
    get socketAddress() {
        return `ws://localhost:${this.port}`;
    }
    invoke(command, args) {
        return new Promise((resolve, reject) => {
            this.socket.send(this.queue.enqueue(command, args, resolve, reject));
        });
    }
    subscribe(arg1, arg2, arg3) {
        let disposable = null;
        let type;
        let callback;
        if (typeof arg1 === 'object' && arg1 instanceof EventEmitter) {
            disposable = arg1;
            type = arg2;
            callback = arg3;
        }
        else {
            type = arg1;
            callback = arg2;
        }
        const subscriber = this.on(type, callback);
        if (this.eventCache.has(type)) {
            callback(this.eventCache.get(type));
        }
        if (disposable) {
            disposable.once('disposed', () => {
                subscriber.unsubscribe();
            });
        }
        return {
            dispose: () => subscriber.unsubscribe()
        };
    }
    onMessage(event) {
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
    parseMessage(data) {
        try {
            return JSON.parse(data);
        }
        catch {
            console.error('Failed to parse message:', data);
        }
    }
};
__decorate([
    Inject,
    __metadata("design:type", ModelFactory)
], Socket.prototype, "modelFactory", void 0);
Socket = __decorate([
    Service({ initializer: sock => sock.connect() }),
    __metadata("design:paramtypes", [])
], Socket);
export { Socket };
//# sourceMappingURL=Socket.js.map
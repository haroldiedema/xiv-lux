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
var IconRepository_1;
import { Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
let IconRepository = class IconRepository {
    static { IconRepository_1 = this; }
    static { this._instance = null; }
    static getInstance() {
        if (!IconRepository_1._instance) {
            throw new Error('IconRepository has not been initialized.');
        }
        return IconRepository_1._instance;
    }
    constructor() {
        this.cache = new Map();
        this.queue = new Set();
        this.tempImage = new Image(8, 8);
        IconRepository_1._instance = this;
    }
    get(iconId) {
        if (this.cache.has(iconId)) {
            return Promise.resolve(this.cache.get(iconId));
        }
        if (this.queue.has(iconId)) {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!this.queue.has(iconId)) {
                        clearInterval(interval);
                        resolve(this.cache.get(iconId));
                    }
                }, 100);
            });
        }
        this.queue.add(iconId);
        return new Promise((resolve) => {
            const img = new Image();
            img.src = `${this.socket.httpAddress}/image/icon/${iconId}.png`;
            img.onload = () => {
                this.cache.set(iconId, img);
                this.queue.delete(iconId);
                resolve(img);
            };
        });
    }
    getCached(iconId) {
        if (!this.cache.has(iconId)) {
            this.get(iconId); // Cache it.
            return this.tempImage;
        }
        return this.cache.get(iconId);
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], IconRepository.prototype, "socket", void 0);
IconRepository = IconRepository_1 = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], IconRepository);
export { IconRepository };
//# sourceMappingURL=IconRepository.js.map
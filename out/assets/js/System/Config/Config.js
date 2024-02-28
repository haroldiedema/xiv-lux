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
import { ConfigVariables } from "@/System/Config/ConfigVariables";
import { EventEmitter } from "@/System/Event";
import { Service } from "@/System/Services";
let Config = class Config extends EventEmitter {
    constructor() {
        super();
        this.writeDebounce = null;
        const userVarsData = typeof localStorage.getItem('lux-config') === 'string'
            ? JSON.parse(localStorage.getItem('lux-config'))
            : {};
        this.data = {};
        Object.keys(ConfigVariables).forEach((name) => this.data[name] = userVarsData[name] ?? ConfigVariables[name].default);
        window.config = this;
    }
    get(id) {
        return this.data[id];
    }
    set(id, value) {
        if (this.data[id] === value) {
            return;
        }
        this.data[id] = value;
        this.dispatch(id, value);
        this.scheduleWrite();
    }
    scheduleWrite() {
        clearTimeout(this.writeDebounce);
        this.writeDebounce = setTimeout(() => localStorage.setItem('lux-config', JSON.stringify(this.data)));
    }
};
Config = __decorate([
    Service(),
    __metadata("design:paramtypes", [])
], Config);
export { Config };
//# sourceMappingURL=Config.js.map
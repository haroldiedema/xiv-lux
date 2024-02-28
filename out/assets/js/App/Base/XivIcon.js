var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { jsx as _jsx } from "@/System/Interface/jsx-runtime";
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { AbstractComponent, Attribute, Inject, UIComponent } from "@/System/Interface";
import { Socket } from "@/System/Socket";
let XivIcon = class XivIcon extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.icon = 0;
        this.size = null;
        this.filter = null;
    }
    render() {
        return (_jsx("ui:host", { style: {
                '--width': this.size ? `${this.size}px` : 'auto',
                '--height': this.size ? `${this.size}px` : 'auto',
                '--filter': this.filter
            }, children: _jsx("img", { src: `${this.socket.httpAddress}/image/icon/${this.icon}.png` }) }));
    }
};
__decorate([
    Attribute,
    __metadata("design:type", Number)
], XivIcon.prototype, "icon", void 0);
__decorate([
    Attribute,
    __metadata("design:type", Number)
], XivIcon.prototype, "size", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], XivIcon.prototype, "filter", void 0);
__decorate([
    Inject,
    __metadata("design:type", Socket)
], XivIcon.prototype, "socket", void 0);
XivIcon = __decorate([
    UIComponent('xiv-icon', '/css/base/xiv-icon.css')
], XivIcon);
export { XivIcon };
//# sourceMappingURL=XivIcon.js.map
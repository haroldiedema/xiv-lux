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
import { RadarRenderer } from "@/App/Applets/Radar/RadarRenderer";
import { AbstractApplet, Applet } from "@/System/Applet";
import { Inject } from "@/System/Interface";
import { Socket } from "@/System/Socket";
let XivRadar = class XivRadar extends AbstractApplet {
    /**
     * @inheritdoc
     */
    onMounted() {
        this.renderer = new RadarRenderer(this.$host.shadowRoot.querySelector('canvas'), this.socket);
    }
    /**
     * @inheritdoc
     */
    onDisposed() {
        this.renderer.dispose();
    }
    /**
     * @inheritdoc
     */
    render() {
        return (_jsx("ui:host", { children: _jsx("canvas", {}) }));
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], XivRadar.prototype, "socket", void 0);
XivRadar = __decorate([
    Applet('xiv-radar', {
        name: 'Radar',
        styleUrl: '/css/applets/xiv-radar.css',
        icon: 'radar',
        isFrameless: true,
        isSingleInstance: true,
        minWidth: 128,
        minHeight: 128,
    })
], XivRadar);
export { XivRadar };
//# sourceMappingURL=XivRadar.js.map
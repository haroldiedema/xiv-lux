var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { jsx as _jsx, jsxs as _jsxs } from "@/System/Interface/jsx-runtime";
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { AppletRepository } from "@/System/Applet";
import { Config } from "@/System/Config";
import { AbstractComponent, Attribute, Inject, UIComponent } from "@/System/Interface";
import { Socket } from "@/System/Socket";
let LuxToolbar = class LuxToolbar extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.isAutoHideEnabled = false;
        this.isMouseOver = false;
        this.isUsingNativeElements = false;
    }
    onMounted() {
        this.isAutoHideEnabled = this.config.get('toolbar.autoHide');
        this.config.on('toolbar.autoHide', (value) => this.isAutoHideEnabled = value);
        this.socket.subscribe('VisibleNativeElements', e => this.isUsingNativeElements = e.length > 0);
        this.socket.subscribe('Gearset', e => console.log('GS:', e));
    }
    render() {
        return (_jsx("ui:host", { class: {
                bottom: this.position === 'bottom',
                top: this.position === 'top',
                autoHide: this.isAutoHideEnabled,
                isMouseOver: this.isMouseOver,
            }, "on:$mouseenter": () => this.isMouseOver = true, "on:$mouseout": () => this.isMouseOver = false, children: _jsxs("main", { children: [_jsx("div", { id: "background" }), _jsxs("section", { children: [_jsx("lux-toolbar-gearset", {}), _jsx("lux-toolbar-companion", {})] }), _jsx("section", {}), _jsxs("section", { class: { 'is-using-native-elements': this.isUsingNativeElements }, children: [AppletRepository.singletonNames.map((name) => (_jsx("lux-toolbar-app", { app: name }))), _jsx("vr", {}), _jsx("lux-toolbar-location", {}), _jsx("lux-toolbar-weather", {}), _jsx("lux-toolbar-clock", {}), _jsx("vr", {}), this.renderAutoHideButton(), this.renderPositionButton()] })] }) }));
    }
    /**
     * Renders the button to toggle the auto-hide feature.
     */
    renderAutoHideButton() {
        return (_jsx("button", { class: "ghost icon", "on:click": () => this.config.set('toolbar.autoHide', !this.isAutoHideEnabled), children: _jsx("fa-icon", { name: 'thumbtack', type: "duotone", size: 14, color: this.isAutoHideEnabled ? '#a09fa0' : '#fff', rotate: this.isAutoHideEnabled ? '45deg' : '0deg', invert: true }) }));
    }
    /**
     * Renders the button to toggle the toolbar position.
     */
    renderPositionButton() {
        return (_jsx("button", { class: "ghost icon", "on:click": () => this.config.set('toolbar.position', this.config.get('toolbar.position') === 'bottom' ? 'top' : 'bottom'), children: _jsx("fa-icon", { name: this.position === 'bottom' ? 'border-bottom' : 'border-top', type: "duotone", color: "#ffa", color2: "#c0bfc0", invert: true }) }));
    }
};
__decorate([
    Attribute,
    __metadata("design:type", String)
], LuxToolbar.prototype, "position", void 0);
__decorate([
    Inject,
    __metadata("design:type", Config)
], LuxToolbar.prototype, "config", void 0);
__decorate([
    Inject,
    __metadata("design:type", Socket)
], LuxToolbar.prototype, "socket", void 0);
LuxToolbar = __decorate([
    UIComponent('lux-toolbar', '/css/toolbar/lux-toolbar.css')
], LuxToolbar);
export { LuxToolbar };
//# sourceMappingURL=LuxToolbar.js.map
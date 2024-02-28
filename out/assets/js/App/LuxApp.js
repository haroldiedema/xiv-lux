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
import { AppletManager } from "@/System/Applet";
import { Config } from "@/System/Config";
import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { GameState } from "@/XIV/GameState";
let LuxApp = class LuxApp extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.containerElement = null;
        this.isToolbarTop = false;
        this.isLoggedIn = false;
        this.nativeElementsVisible = false;
    }
    onMounted() {
        window.i = this.invoker;
        this.gameState.on('login', () => this.onLogin());
        this.gameState.on('logout', () => this.onLogout());
        this.config.on('toolbar.position', (value) => this.isToolbarTop = value === 'top');
        this.config.get('toolbar.position') === 'top';
        this.socket.subscribe('VisibleNativeElements', e => {
            this.nativeElementsVisible = e.length > 0;
            console.log(e);
        });
        this.isToolbarTop = this.config.get('toolbar.position') === 'top';
        if (this.gameState.isLoggedIn) {
            this.onLogin();
        }
    }
    render() {
        if (!this.isLoggedIn) {
            return (_jsx("ui:host", {}));
        }
        return (_jsxs("ui:host", { children: [_jsx("main", { ref: (el) => this.containerElement = el, style: { top: this.isToolbarTop ? '32px' : '0px' }, class: { hidden: this.nativeElementsVisible } }), _jsx("aside", { style: {
                        top: this.isToolbarTop ? '0px' : 'unset',
                        bottom: this.isToolbarTop ? 'unset' : '0px',
                    }, children: _jsx("lux-toolbar", { position: this.isToolbarTop ? 'top' : 'bottom' }) })] }));
    }
    onLogin() {
        this.isLoggedIn = true;
        this.enqueueDeferredTask(() => {
            this.appletManager.initialize(this.containerElement);
        });
    }
    onLogout() {
        this.isLoggedIn = false;
        this.appletManager.dispose();
    }
};
__decorate([
    Inject,
    __metadata("design:type", Config)
], LuxApp.prototype, "config", void 0);
__decorate([
    Inject,
    __metadata("design:type", Socket)
], LuxApp.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], LuxApp.prototype, "invoker", void 0);
__decorate([
    Inject,
    __metadata("design:type", AppletManager)
], LuxApp.prototype, "appletManager", void 0);
__decorate([
    Inject,
    __metadata("design:type", GameState)
], LuxApp.prototype, "gameState", void 0);
LuxApp = __decorate([
    UIComponent('lux-app', '/css/base/lux-app.css')
], LuxApp);
export { LuxApp };
//# sourceMappingURL=LuxApp.js.map
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
import { AppletManager, AppletRepository } from "@/System/Applet";
import { AbstractComponent, Attribute, UIComponent } from "@/System/Interface";
import { Inject } from "@/System/Interface";
let LuxToolbarApp = class LuxToolbarApp extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.name = '';
        this.icon = '';
        this.isOpen = false;
    }
    /**
     * @inheritdoc
     */
    onCreated() {
        const options = AppletRepository.get(this.app).options;
        this.isOpen = this.appletManager.isOpen(this.app);
        this.name = options.name;
        this.icon = options.icon;
        this.openedListener = this.appletManager.on('applet-opened', (app) => {
            if (app === this.app) {
                this.isOpen = true;
            }
        });
        this.closedListener = this.appletManager.on('applet-closed', (app) => {
            if (app === this.app) {
                this.isOpen = false;
            }
        });
    }
    /**
     * @inheritdoc
     */
    onDisposed() {
        this.openedListener.unsubscribe();
        this.closedListener.unsubscribe();
    }
    /**
     * @inheritdoc
     */
    render() {
        return (_jsx("ui:host", { children: _jsxs("main", { "on:click": () => this.toggleApplet(), class: { active: this.isOpen }, children: [this.renderIcon(), _jsx("div", { class: "name", children: this.name })] }) }));
    }
    toggleApplet() {
        this.appletManager.toggle(this.app);
    }
    renderIcon() {
        if (!this.icon) {
            return null;
        }
        if (!isNaN(parseInt(this.icon))) {
            return (_jsx("div", { class: "icon", children: _jsx("xiv-icon", { icon: this.icon, size: 16 }) }));
        }
        return (_jsx("div", { class: "icon", children: _jsx("fa-icon", { name: this.icon, size: 16, type: "duotone", color: "#c0facf" }) }));
    }
};
__decorate([
    Attribute,
    __metadata("design:type", String)
], LuxToolbarApp.prototype, "app", void 0);
__decorate([
    Inject,
    __metadata("design:type", AppletManager)
], LuxToolbarApp.prototype, "appletManager", void 0);
LuxToolbarApp = __decorate([
    UIComponent("lux-toolbar-app", "/css/toolbar/lux-toolbar-app.css")
], LuxToolbarApp);
export { LuxToolbarApp };
//# sourceMappingURL=LuxToolbarApp.js.map
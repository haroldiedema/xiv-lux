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
import { AbstractComponent, Attribute, UIComponent } from "@/System/Interface";
let WorldMapToolbarButton = class WorldMapToolbarButton extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.label = '';
        this.tooltip = '';
        this.icon = 'checkmark';
        this.icon2 = '';
        this.disabled = false;
        this.color = null;
    }
    render() {
        return (_jsxs("ui:host", { class: { disabled: this.disabled }, children: [_jsxs("main", { children: [this.renderIcon(this.icon), this.icon2 && _jsx("div", { children: this.renderIcon(this.icon2, 22) })] }), _jsx("div", { class: "tooltip", children: this.tooltip })] }));
    }
    renderIcon(icon, size = 32, color = null) {
        if (!isNaN(parseInt(icon))) {
            return _jsx("xiv-icon", { icon: icon, size: size });
        }
        return _jsx("fa-icon", { name: icon, type: "duotone", size: size - 12, color: this.color || '#fff' });
    }
};
__decorate([
    Attribute,
    __metadata("design:type", String)
], WorldMapToolbarButton.prototype, "label", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], WorldMapToolbarButton.prototype, "tooltip", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], WorldMapToolbarButton.prototype, "icon", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], WorldMapToolbarButton.prototype, "icon2", void 0);
__decorate([
    Attribute,
    __metadata("design:type", Boolean)
], WorldMapToolbarButton.prototype, "disabled", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], WorldMapToolbarButton.prototype, "color", void 0);
WorldMapToolbarButton = __decorate([
    UIComponent('xiv-world-map-toolbar-button', '/css/applets/xiv-world-map-toolbar-button.css')
], WorldMapToolbarButton);
export { WorldMapToolbarButton };
//# sourceMappingURL=WorldMapToolbarButton.js.map
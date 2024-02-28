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
import { AbstractComponent, Attribute, UIComponent, Watch } from "@/System/Interface";
let LuxPanel = class LuxPanel extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.isZeroWidth = true;
    }
    render() {
        return (_jsx("ui:host", { style: this.getStyle(), class: { hidden: this.hidden, isZeroWidth: this.isZeroWidth }, children: _jsx("slot", {}) }));
    }
    getStyle() {
        switch (this.a) {
            case 'top-left':
                return { top: this.y + 'px', left: this.x + 'px', bottom: 'unset', right: 'unset' };
            case 'top-right':
                return { top: this.y + 'px', right: this.x + 'px', bottom: 'unset', left: 'unset' };
            case 'bottom-left':
                return { bottom: this.y + 'px', left: this.x + 'px', top: 'unset', right: 'unset' };
            case 'bottom-right':
                return { bottom: this.y + 'px', right: this.x + 'px', top: 'unset', left: 'unset' };
            default:
                return { top: this.y + 'px', left: this.x + 'px', bottom: 'unset', right: 'unset' };
        }
    }
    onParentChanged(parent) {
    }
    onHiddenChanged(hidden) {
        if (hidden) {
            return cancelAnimationFrame(this.rafHandle);
        }
        this.tick();
    }
    tick() {
        this.rafHandle = requestAnimationFrame(() => this.tick());
        const aRect = this.anchor.getBoundingClientRect();
        const sRect = this.$host.getBoundingClientRect();
        this.isZeroWidth = sRect.width === 0;
        let vAnchor = 'top', hAnchor = 'left', x = aRect.x, y = aRect.height;
        if (aRect.y > window.innerHeight / 2) {
            vAnchor = 'bottom';
        }
        if (aRect.x > window.innerWidth / 2) {
            hAnchor = 'right';
            x = (window.innerWidth - aRect.x) - aRect.width;
        }
        const offset = (sRect.width > 0) ? ((aRect.width / 2) - (sRect.width / 2)) : 0;
        this.a = `${vAnchor}-${hAnchor}`;
        this.x = x + offset;
        this.y = y;
    }
};
__decorate([
    Attribute,
    __metadata("design:type", HTMLElement)
], LuxPanel.prototype, "anchor", void 0);
__decorate([
    Attribute,
    __metadata("design:type", Boolean)
], LuxPanel.prototype, "hidden", void 0);
__decorate([
    Watch('parent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HTMLElement]),
    __metadata("design:returntype", void 0)
], LuxPanel.prototype, "onParentChanged", null);
__decorate([
    Watch('hidden'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], LuxPanel.prototype, "onHiddenChanged", null);
LuxPanel = __decorate([
    UIComponent('lux-panel', '/css/base/lux-panel.css')
], LuxPanel);
export { LuxPanel };
//# sourceMappingURL=LuxPanel.js.map
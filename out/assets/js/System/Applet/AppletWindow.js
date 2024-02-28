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
import { AppletConfig as AppletContext } from "@/System/Applet/AppletContext";
import { AppletRepository } from "@/System/Applet/AppletRepository";
import { AbstractComponent, Attribute, UIComponent, Watch } from "@/System/Interface";
import { Bound } from "@/System/Types";
let AppletWindow = class AppletWindow extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.isConfigMode = false;
        this.isMoving = false;
        this.posX = 150;
        this.posY = 150;
        this.width = 100;
        this.minWidth = 100;
        this.height = 100;
        this.minHeight = 100;
    }
    onCreated() {
        const applet = AppletRepository.get(this.component);
        this.element = document.createElement(applet.tagName);
        this.minWidth = applet.options.minWidth;
        this.minHeight = applet.options.minHeight;
        this.width = this.minWidth;
        this.height = this.minHeight;
        this.instance = this.element.$component;
        this.title = applet.options.name;
        this.isFrameless = applet.options.isFrameless;
        if (!this.instance) {
            throw new Error(`Applet '${this.component}' is not a valid component.`);
        }
        const config = new AppletContext(applet.options, JSON.parse(this.argument));
        config.on('name', v => this.title = v);
        config.on('isFrameless', v => this.isFrameless = v);
        Object.defineProperty(this.instance, 'context', { get: () => config });
    }
    onMounted() {
        // this.$host.shadowRoot.querySelector('#content').appendChild(this.element);
    }
    render() {
        return (_jsxs("ui:host", { "on:$mousedown": this.onHostMouseDown, style: {
                '--x': `${this.posX}px`,
                '--y': `${this.posY}px`,
                '--min-width': this.width + 'px',
                '--min-height': this.height + 'px',
            }, children: [_jsxs("main", { class: { frameless: this.isFrameless }, children: [!this.isFrameless && (_jsxs("header", { "on:$mousedown": this.onConfigMouseDown, "on:$mouseup": this.onConfigMouseUp, "on:$mousemove": this.onConfigMouseMove, "on:$mouseleave": this.onMouseLeave, children: [_jsx("div", { class: "title", children: this.title }), _jsxs("div", { children: [_jsx("button", { class: "ghost", "on:click": () => this.isConfigMode = !this.isConfigMode, children: _jsx("fa-icon", { name: "cog", type: "solid", size: 12 }) }), _jsx("button", { class: "ghost", "on:click": () => this.$host.remove(), children: _jsx("fa-icon", { name: "times", type: "regular" }) })] })] })), _jsx("div", { id: "content", "html:raw": this.element })] }), this.isConfigMode && (_jsxs("div", { id: "config", "on:$mousedown": this.onConfigMouseDown, "on:$mouseup": this.onConfigMouseUp, "on:$mousemove": this.onConfigMouseMove, "on:$mouseleave": this.onMouseLeave, "on:$wheel": this.onConfigWheel, children: [this.width > 400 && this.height > 200 && (_jsxs("div", { children: [_jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "Left mouse + drag" }), _jsx("span", { children: "to move the window around." })] }), _jsxs("li", { children: [_jsx("code", { children: "Mouse wheel" }), _jsx("span", { children: "to resize the window horizontally." })] }), _jsxs("li", { children: [_jsx("code", { children: "Mouse wheel + shift" }), _jsx("span", { children: "to resize the window vertically." })] })] }), _jsxs("i", { children: ["You can access this mode anytime by clicking the ", _jsx("code", { children: "mouse wheel" }), " while holding the ", _jsx("code", { children: "control key" }), "."] })] })), _jsxs("button", { class: "large", "on:click": () => this.isConfigMode = !this.isConfigMode, children: [_jsx("fa-icon", { name: "check" }), " Ready"] })] }))] }));
    }
    onHostMouseDown(e) {
        if (!this.isConfigMode && e.button === 1 && e.ctrlKey) {
            this.isConfigMode = true;
        }
    }
    onConfigMouseDown(e) {
        if (e.button !== 0 || e.composedPath().find((el) => el.tagName?.toLowerCase() === 'button')) {
            return;
        }
        this.isMoving = true;
    }
    onConfigMouseUp(e) {
        this.isMoving = false;
        this.dispatchState();
    }
    onConfigMouseMove(e) {
        if (!this.isMoving) {
            return;
        }
        this.posX += e.movementX;
        this.posY += e.movementY;
    }
    onMouseLeave() {
        if (this.isMoving) {
            this.isMoving = false;
            this.dispatchState();
        }
    }
    onConfigWheel(e) {
        let value = (e.deltaY > 0 ? 1 : -1) * (e.ctrlKey ? 1 : 10);
        if (e.shiftKey) {
            this.height = Math.max(this.minHeight, this.height + value);
        }
        else {
            this.width = Math.max(this.minWidth, this.width + value);
        }
        this.dispatchState();
    }
    dispatchState() {
        this.$host.dispatchEvent(new CustomEvent('state-changed', {
            detail: {
                x: this.posX,
                y: this.posY,
                width: this.width,
                height: this.height,
            }
        }));
    }
    onStateChange(value) {
        if (!value) {
            return;
        }
        const state = JSON.parse(value);
        if (!state) {
            return;
        }
        this.posX = state.x;
        this.posY = state.y;
        this.width = state.width;
        this.height = state.height;
    }
};
__decorate([
    Attribute,
    __metadata("design:type", String)
], AppletWindow.prototype, "identifier", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], AppletWindow.prototype, "component", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], AppletWindow.prototype, "argument", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], AppletWindow.prototype, "state", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], AppletWindow.prototype, "onHostMouseDown", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], AppletWindow.prototype, "onConfigMouseDown", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], AppletWindow.prototype, "onConfigMouseUp", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], AppletWindow.prototype, "onConfigMouseMove", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppletWindow.prototype, "onMouseLeave", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WheelEvent]),
    __metadata("design:returntype", void 0)
], AppletWindow.prototype, "onConfigWheel", null);
__decorate([
    Watch('state', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppletWindow.prototype, "onStateChange", null);
AppletWindow = __decorate([
    UIComponent('lux-applet-window', '/css/base/lux-applet-window.css')
], AppletWindow);
export { AppletWindow };
//# sourceMappingURL=AppletWindow.js.map
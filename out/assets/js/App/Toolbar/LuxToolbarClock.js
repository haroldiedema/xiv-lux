var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { jsx as _jsx, jsxs as _jsxs } from "@/System/Interface/jsx-runtime";
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { AbstractComponent, UIComponent } from "@/System/Interface";
let LuxToolbarClock = class LuxToolbarClock extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.localTime = '00:00';
        this.eoreaTime = '00:00';
        this.timer = null;
    }
    /**
     * @inheritdoc
     */
    onMounted() {
        this.timer = setInterval(() => {
            const eTime = new Date(Date.now() * 20.571428571428573);
            const lTime = new Date();
            this.eoreaTime = this.dateToString(eTime, true);
            this.localTime = this.dateToString(lTime, false);
        }, 500);
    }
    /**
     * @inheritdoc
     */
    onDisposed() {
        this.timer && clearInterval(this.timer);
    }
    /**
     * @inheritdoc
     */
    render() {
        return (_jsxs("ui:host", { children: [_jsxs("div", { class: "clock", children: [_jsx("label", { children: "ET" }), _jsx("div", { children: this.eoreaTime })] }), _jsxs("div", { class: "clock", children: [_jsx("label", { children: "LT" }), _jsx("div", { children: this.localTime })] })] }));
    }
    /**
     * Converts a date to a string.
     */
    dateToString(date, useUTC = false) {
        return [
            `0${useUTC ? date.getUTCHours() : date.getHours()}`.slice(-2),
            `0${useUTC ? date.getUTCMinutes() : date.getMinutes()}`.slice(-2),
        ].join(':');
    }
};
LuxToolbarClock = __decorate([
    UIComponent("lux-toolbar-clock", "/css/toolbar/lux-toolbar-clock.css")
], LuxToolbarClock);
export { LuxToolbarClock };
//# sourceMappingURL=LuxToolbarClock.js.map
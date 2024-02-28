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
import { AbstractComponent, Inject, UIComponent } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
let LuxToolbarWeather = class LuxToolbarWeather extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.forecast = [];
        this.currentZone = null;
        this.showPanel = false;
    }
    /**
     * @inheritdoc
     */
    async onMounted() {
        this.socket.subscribe(this, 'CurrentWeatherForecast', fc => this.forecast = fc);
        this.socket.subscribe(this, 'CurrentZone', zone => this.currentZone = zone);
    }
    /**
     * @inheritdoc
     */
    onDisposed() {
    }
    /**
     * @inheritdoc
     */
    render() {
        if (this.forecast.length === 0 || !this.currentZone) {
            return _jsx("ui:host", {});
        }
        return (_jsxs("ui:host", { "on:$mousedown": () => this.showPanel = true, "on:$mouseleave": () => this.showPanel = false, children: [_jsxs("div", { class: "name", children: [_jsx("div", { children: this.forecast[0].name }), _jsx("div", { children: this.forecast[1]?.time.replace(/^(In )/g, '') ?? 'Everlasting' })] }), _jsx("div", { class: "icon", children: _jsx("xiv-icon", { icon: this.forecast[0].iconId, size: 20 }) }), _jsx("lux-panel", { anchor: this.$host, hidden: !this.showPanel, children: this.renderForcastPanel() })] }));
    }
    renderForcastPanel() {
        let lastName = '';
        return (_jsx("table", { children: _jsxs("tbody", { children: [_jsx("tr", { children: _jsxs("th", { colspan: 2, class: "header", children: [_jsx("h3", { children: "Weather forecast in" }), _jsx("div", { children: this.currentZone.placeName })] }) }), this.forecast.slice(1).map((f, i) => {
                        if (f.name === lastName) {
                            return null;
                        }
                        lastName = f.name;
                        return (_jsxs("tr", { children: [_jsx("td", { class: "fc-icon", children: _jsx("xiv-icon", { icon: f.iconId, size: 32 }) }), _jsxs("td", { class: "fc-name", valign: "middle", children: [f.name, _jsx("div", { children: f.time })] })] }, i));
                    })] }) }));
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], LuxToolbarWeather.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], LuxToolbarWeather.prototype, "invoker", void 0);
LuxToolbarWeather = __decorate([
    UIComponent("lux-toolbar-weather", "/css/toolbar/lux-toolbar-weather.css")
], LuxToolbarWeather);
export { LuxToolbarWeather };
//# sourceMappingURL=LuxToolbarWeather.js.map
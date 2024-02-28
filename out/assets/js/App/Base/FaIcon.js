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
import { AbstractComponent, Attribute, Inject, UIComponent, Watch } from "@/System/Interface";
import { Service } from "@/System/Services";
let FaIconLib = class FaIconLib {
    constructor() {
        this.icons = new Map();
    }
    async initialize() {
        const data = await fetch('/iconlib.json').then(r => r.json());
        data.forEach((i) => {
            this.icons.set(i.name, i);
            i.terms.forEach((term) => {
                if (false == this.icons.has(term)) {
                    this.icons.set(term, i);
                }
            });
        });
    }
};
FaIconLib = __decorate([
    Service({ initializer: i => i.initialize() })
], FaIconLib);
export { FaIconLib };
let FaIcon = class FaIcon extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.type = 'regular';
        this.size = 16;
        this.invert = false;
        this.color = '#fff';
        this.color2 = null;
        this.rotate = '0deg';
        this.svg = '';
    }
    render() {
        return (_jsx("ui:host", { style: {
                '--size': this.size + 'px',
                '--color': this.color,
                '--alt-color': this.color2,
                '--rotate': this.rotate,
            }, children: _jsx("main", { "html:raw": this.svg }) }));
    }
    onNameChanged() {
        const icon = this.lib.icons.get(this.name);
        if (!icon) {
            throw new Error(`Icon '${this.name}' does not exist.`);
        }
        const paths = icon.types[this.type]?.map(p => `<path d="${p}"/>`) ?? null;
        if (!paths) {
            throw new Error(`Icon '${this.name}' does not have a type '${this.type}'.`);
        }
        if (this.invert) {
            paths.reverse();
        }
        this.svg = `<svg viewBox="${icon.box.join(' ')}">${paths}</svg>`;
    }
};
__decorate([
    Attribute,
    __metadata("design:type", String)
], FaIcon.prototype, "name", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], FaIcon.prototype, "type", void 0);
__decorate([
    Attribute,
    __metadata("design:type", Number)
], FaIcon.prototype, "size", void 0);
__decorate([
    Attribute,
    __metadata("design:type", Boolean)
], FaIcon.prototype, "invert", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], FaIcon.prototype, "color", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], FaIcon.prototype, "color2", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], FaIcon.prototype, "rotate", void 0);
__decorate([
    Inject,
    __metadata("design:type", FaIconLib)
], FaIcon.prototype, "lib", void 0);
__decorate([
    Watch('name', true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FaIcon.prototype, "onNameChanged", null);
FaIcon = __decorate([
    UIComponent('fa-icon', '/css/base/fa-icon.css')
], FaIcon);
export { FaIcon };
//# sourceMappingURL=FaIcon.js.map
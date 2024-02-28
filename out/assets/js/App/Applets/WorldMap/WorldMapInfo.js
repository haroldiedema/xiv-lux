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
import { Raycaster } from "@/App/Applets/WorldMap/Interaction/Raycaster";
import { AbstractComponent, Attribute, Inject, UIComponent } from "@/System/Interface";
import { Socket } from "@/System/Socket";
let WorldMapInfo = class WorldMapInfo extends AbstractComponent {
    constructor() {
        super(...arguments);
        this.anchor = 'left';
        this.height = 100;
        this.raf = null;
        this.hit = null;
        this.itemRewards = [];
        this.optionalItemRewards = [];
        this.gilReward = 0;
        this.emoteReward = null;
        this.actionReward = null;
    }
    onMounted() {
        cancelAnimationFrame(this.raf);
        this.update();
    }
    onDisposed() {
        cancelAnimationFrame(this.raf);
    }
    render() {
        if (!this.hit || !this.hit?.metadata?.quest) {
            return _jsx("ui:host", { class: "hidden" });
        }
        const quest = this.hit.metadata.quest;
        const iconId = this.hit.metadata.iconId;
        const jobIconId = quest.requiredJobId ? quest.requiredJobId + 62000 : 61696;
        const bannerImg = quest.bannerImage ? `url('${this.socket.httpAddress}/image/icon/${quest.bannerImage}.png')` : 'none';
        return (_jsxs("ui:host", { class: `visible anchor-${this.anchor}`, style: {
                right: this.anchor === 'left' ? `${this.x}px` : 'unset',
                left: this.anchor === 'right' ? `${this.x}px` : 'unset',
                maxHeight: `${this.height}px`
            }, children: [_jsxs("header", { style: { '--bg': bannerImg }, children: [_jsx("img", { src: `${this.socket.httpAddress}/image/icon/${iconId}-hr.png` }), _jsxs("div", { children: [_jsx("h1", { children: quest.name }), _jsxs("div", { children: [_jsx("img", { src: `${this.socket.httpAddress}/image/icon/${jobIconId}.png`, style: { width: jobIconId === 61696 ? '0' : '32px' } }), _jsx("span", { children: quest.requiredJobCategory }), _jsx("span", { children: quest.requiredJobLevel > 1 ? `Lv. ${quest.requiredJobLevel}` : 'All levels' })] })] })] }), _jsxs("main", { children: [this.gilReward > 0 && (_jsxs("div", { class: "reward-card", children: [_jsx("div", { class: "title", children: "Gil reward" }), _jsx("xiv-icon", { icon: 65002, size: 32 }), _jsx("span", { class: "currency-amount", children: this.gilReward })] })), this.actionReward && (_jsxs("div", { class: "reward-card", children: [_jsx("div", { class: "title", children: "Action reward" }), _jsx("xiv-icon", { icon: this.actionReward.iconId, size: 32 }), _jsxs("div", { children: [_jsx("div", { class: "item-name", children: this.actionReward.name }), _jsx("div", { class: "item-cat", children: this.actionReward.category })] })] })), this.emoteReward && (_jsxs("div", { class: "reward-card", children: [_jsx("div", { class: "title", children: "Emote reward" }), _jsx("xiv-icon", { icon: this.emoteReward.iconId, size: 32 }), _jsxs("div", { children: [_jsx("div", { class: "item-name", children: this.emoteReward.name }), _jsx("div", { class: "item-cat", children: "Emote" })] })] }))] }), _jsxs("main", { children: [this.itemRewards.length > 0 && (_jsxs("div", { class: "reward-card list", children: [_jsx("div", { class: "title", children: "Item rewards" }), this.itemRewards.map(item => (_jsxs("div", { class: "item", children: [_jsx("xiv-icon", { icon: item.iconId, size: 32 }), _jsxs("div", { children: [_jsx("div", { class: "item-name", children: item.name }), _jsx("div", { class: "item-cat", children: item.categoryName })] })] })))] })), this.optionalItemRewards.length > 0 && (_jsxs("div", { class: "reward-card list", children: [_jsx("div", { class: "title", children: "Optional item rewards" }), this.optionalItemRewards.map(item => (_jsxs("div", { class: "item", children: [_jsx("xiv-icon", { icon: item.iconId, size: 32 }), _jsxs("div", { children: [_jsx("div", { class: "item-name", children: item.name }), _jsx("div", { class: "item-cat", children: item.categoryName })] })] })))] }))] })] }));
    }
    update() {
        this.hit = this.raycaster.hitCandidate;
        this.raf = requestAnimationFrame(() => this.update());
        if (this.hit && this.hit.metadata.quest) {
            const quest = this.hit.metadata.quest;
            this.gilReward = quest.rewards.gil;
            this.itemRewards = quest.rewards.items;
            this.optionalItemRewards = quest.rewards.optionalItems;
            this.emoteReward = quest.rewards.emote;
            this.actionReward = quest.rewards.action;
        }
        else {
            this.gilReward = 0;
            this.itemRewards = [];
            this.optionalItemRewards = [];
            this.emoteReward = null;
            this.actionReward = null;
        }
    }
};
__decorate([
    Attribute,
    __metadata("design:type", Number)
], WorldMapInfo.prototype, "x", void 0);
__decorate([
    Attribute,
    __metadata("design:type", String)
], WorldMapInfo.prototype, "anchor", void 0);
__decorate([
    Attribute,
    __metadata("design:type", Number)
], WorldMapInfo.prototype, "height", void 0);
__decorate([
    Inject,
    __metadata("design:type", Raycaster)
], WorldMapInfo.prototype, "raycaster", void 0);
__decorate([
    Inject,
    __metadata("design:type", Socket)
], WorldMapInfo.prototype, "socket", void 0);
WorldMapInfo = __decorate([
    UIComponent('xiv-world-map-info', '/css/applets/xiv-world-map-info.css')
], WorldMapInfo);
export { WorldMapInfo };
//# sourceMappingURL=WorldMapInfo.js.map
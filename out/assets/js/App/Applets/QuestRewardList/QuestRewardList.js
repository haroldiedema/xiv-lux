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
import { AbstractApplet, Applet } from "@/System/Applet";
import { Inject } from "@/System/Interface";
import { Invoker, Socket } from "@/System/Socket";
import { Bound } from "@/System/Types";
import { Zone } from "@/XIV/Models/Generated";
let QuestRewardList = class QuestRewardList extends AbstractApplet {
    constructor() {
        super(...arguments);
        this.totalGilReward = 0;
        this.allMarkers = [];
        this.emoteRewards = [];
        this.skillRewards = [];
        this.itemRewards = [];
        this.zoneId = 0;
        this.terrId = 0;
    }
    /**
     * @inheritdoc
     */
    onMounted() {
        this.socket.subscribe('CurrentZone', this.onCurrentZoneChanged);
        this.socket.subscribe('QuestMarkers', this.onQuestMarkersUpdated);
    }
    /**
     * @inheritdoc
     */
    render() {
        if (this.isEmpty()) {
            return (_jsx("ui:host", { children: _jsx("main", { class: "empty", children: _jsx("div", { children: "No quest rewards available in this zone." }) }) }));
        }
        return (_jsx("ui:host", { children: _jsxs("main", { children: [this.totalGilReward > 0 && (_jsx("section", { children: _jsxs("div", { class: "total-gil-reward", children: [this.drawIcon(65002, 32), _jsxs("div", { children: [_jsx("div", { children: "Total gil earned by completion of all quests in this zone:" }), _jsx("div", { children: this.totalGilReward.toLocaleString('nl') })] })] }, "gil") })), this.emoteRewards.length > 0 && (_jsxs("section", { children: [_jsx("label", { children: "Emote rewards" }), this.renderEmoteRewards()] }, "emote")), this.skillRewards.length > 0 && (_jsxs("section", { children: [_jsx("label", { children: "Action rewards" }), this.renderSkillRewards()] }, "skill")), this.itemRewards.length > 0 && (_jsxs("section", { children: [_jsx("label", { children: "Item rewards" }), this.renderItemRewards()] }, "item"))] }) }));
    }
    isEmpty() {
        return this.totalGilReward === 0 && this.emoteRewards.length === 0 && this.skillRewards.length === 0 && this.itemRewards.length === 0;
    }
    renderEmoteRewards() {
        return this.emoteRewards.map(reward => (_jsxs("div", { class: "reward emote", children: [this.drawIcon(reward.item.iconId, 32), _jsx("div", { class: "info", children: _jsx("div", { class: "name", children: reward.item.name }) }), _jsxs("div", { class: "source", children: [_jsx("div", { children: _jsx("a", { href: "#", "on:click": () => this.invoker.zone.setFlagMarker(this.zoneId, this.terrId, reward.marker.position.x, reward.marker.position.y), children: reward.marker.quest.name }) }), _jsxs("div", { class: "sub", children: [_jsx("div", { children: reward.marker.quest.requiredJobCategory }), _jsxs("div", { children: ["Lvl.", reward.marker.quest.requiredJobLevel] })] })] })] })));
    }
    renderSkillRewards() {
        return this.skillRewards.map(reward => (_jsxs("div", { class: "reward action", children: [this.drawIcon(reward.item.iconId, 32), _jsxs("div", { class: "info", children: [_jsx("div", { class: "name", children: reward.item.name }), _jsx("div", { class: "sub", children: _jsx("span", { children: reward.item.category }) })] }), _jsxs("div", { class: "source", children: [_jsx("div", { children: _jsx("a", { href: "#", "on:click": () => this.invoker.zone.setFlagMarker(this.zoneId, this.terrId, reward.marker.position.x, reward.marker.position.y), children: reward.marker.quest.name }) }), _jsxs("div", { class: "sub", children: [_jsx("div", { children: reward.marker.quest.requiredJobCategory }), _jsxs("div", { children: ["Lvl.", reward.marker.quest.requiredJobLevel] })] })] })] })));
    }
    renderItemRewards() {
        return this.itemRewards.map(reward => (_jsxs("div", { class: "reward item", children: [this.drawIcon(reward.item.iconId, 32), _jsxs("div", { class: "info", children: [_jsx("div", { class: "name", children: reward.item.name }), _jsxs("div", { class: "sub", children: [_jsx("span", { children: reward.item.categoryName }), _jsx("span", { children: reward.item.jobCategory }), _jsxs("span", { children: ["Req. lvl: ", reward.item.requiredLevel] }), _jsxs("span", { children: ["Item lvl: ", reward.item.itemLevel] })] })] }), _jsxs("div", { class: "source", children: [_jsx("div", { children: _jsx("a", { href: "#", "on:click": () => this.invoker.zone.setFlagMarker(this.zoneId, this.terrId, reward.marker.position.x, reward.marker.position.y), children: reward.marker.quest.name }) }), _jsxs("div", { class: "sub", children: [_jsx("div", { children: reward.marker.quest.requiredJobCategory }), _jsxs("div", { children: ["Lvl.", reward.marker.quest.requiredJobLevel] })] })] })] })));
    }
    drawIcon(iconId, size) {
        return (_jsx("img", { src: `${this.socket.httpAddress}/image/icon/${iconId}.png`, style: {
                width: `${size}px`,
                height: `${size}px`,
            } }));
    }
    onCurrentZoneChanged(zone) {
        const name = [zone.placeName];
        if (zone.placeNameSub) {
            name.unshift(zone.placeNameSub);
        }
        this.context.name = `Quest Rewards in "${name.join(', ')}"`;
        this.zoneId = zone.id;
        this.terrId = zone.territoryId;
        // In sub-zones, markers aren't updated. We need to manually trigger the update.
        this.onQuestMarkersUpdated(this.allMarkers);
    }
    onQuestMarkersUpdated(markers) {
        this.allMarkers = markers;
        this.totalGilReward = 0;
        this.emoteRewards = [];
        this.skillRewards = [];
        this.itemRewards = [];
        let totalGil = 0;
        for (const marker of markers) {
            if (marker.mapId !== this.zoneId) {
                continue;
            }
            if (marker.quest.rewards.gil) {
                totalGil += marker.quest.rewards.gil;
            }
            if (marker.quest.rewards.emote) {
                this.emoteRewards.push({ marker, item: marker.quest.rewards.emote });
            }
            if (marker.quest.rewards.action) {
                this.skillRewards.push({ marker, item: marker.quest.rewards.action });
            }
            if (marker.quest.rewards.items?.length > 0) {
                for (const item of marker.quest.rewards.items) {
                    this.itemRewards.push({ marker, item });
                }
            }
            if (marker.quest.rewards.optionalItems?.length > 0) {
                for (const item of marker.quest.rewards.optionalItems) {
                    this.itemRewards.push({ marker, item });
                }
            }
        }
        this.emoteRewards.sort((a, b) => a.item.name.localeCompare(b.item.name));
        this.skillRewards.sort((a, b) => a.item.name.localeCompare(b.item.name));
        this.itemRewards.sort((a, b) => a.item.name.localeCompare(b.item.name));
        this.itemRewards.sort((a, b) => a.item.categoryName.localeCompare(b.item.categoryName));
        this.enqueueDeferredTask(() => {
            this.totalGilReward = Math.max(0, totalGil);
            this.emoteRewards = [...this.emoteRewards];
            this.skillRewards = [...this.skillRewards];
            this.itemRewards = [...this.itemRewards];
        });
    }
};
__decorate([
    Inject,
    __metadata("design:type", Socket)
], QuestRewardList.prototype, "socket", void 0);
__decorate([
    Inject,
    __metadata("design:type", Invoker)
], QuestRewardList.prototype, "invoker", void 0);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Zone]),
    __metadata("design:returntype", void 0)
], QuestRewardList.prototype, "onCurrentZoneChanged", null);
__decorate([
    Bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], QuestRewardList.prototype, "onQuestMarkersUpdated", null);
QuestRewardList = __decorate([
    Applet('xiv-quest-rewards-list', {
        name: 'Quest Reward List',
        icon: 'book',
        styleUrl: '/css/applets/xiv-quest-rewards-list.css',
        isSingleInstance: true,
        isFrameless: false,
        minWidth: 600,
        minHeight: 250,
    })
], QuestRewardList);
export { QuestRewardList };
//# sourceMappingURL=QuestRewardList.js.map
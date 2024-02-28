/* This file was generated by Lux. Do not modify. */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Offset, ModelStruct } from '@/System/Serializer';
import { Emote } from '@/XIV/Models/Generated/Emote';
import { SkillAction } from '@/XIV/Models/Generated/SkillAction';
let QuestRewards = class QuestRewards {
};
__decorate([
    Offset(0),
    __metadata("design:type", Number)
], QuestRewards.prototype, "gil", void 0);
__decorate([
    Offset(1),
    __metadata("design:type", Array)
], QuestRewards.prototype, "items", void 0);
__decorate([
    Offset(2),
    __metadata("design:type", Array)
], QuestRewards.prototype, "optionalItems", void 0);
__decorate([
    Offset(3),
    __metadata("design:type", Emote)
], QuestRewards.prototype, "emote", void 0);
__decorate([
    Offset(4),
    __metadata("design:type", SkillAction)
], QuestRewards.prototype, "action", void 0);
__decorate([
    Offset(5),
    __metadata("design:type", Array)
], QuestRewards.prototype, "generalActions", void 0);
QuestRewards = __decorate([
    ModelStruct('QuestRewards')
], QuestRewards);
export { QuestRewards };
//# sourceMappingURL=QuestRewards.js.map
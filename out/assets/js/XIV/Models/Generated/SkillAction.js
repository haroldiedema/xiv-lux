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
let SkillAction = class SkillAction {
};
__decorate([
    Offset(0),
    __metadata("design:type", Number)
], SkillAction.prototype, "id", void 0);
__decorate([
    Offset(1),
    __metadata("design:type", Number)
], SkillAction.prototype, "iconId", void 0);
__decorate([
    Offset(2),
    __metadata("design:type", String)
], SkillAction.prototype, "name", void 0);
__decorate([
    Offset(3),
    __metadata("design:type", String)
], SkillAction.prototype, "category", void 0);
__decorate([
    Offset(4),
    __metadata("design:type", Number)
], SkillAction.prototype, "jobId", void 0);
__decorate([
    Offset(5),
    __metadata("design:type", Number)
], SkillAction.prototype, "jobLevel", void 0);
__decorate([
    Offset(6),
    __metadata("design:type", Boolean)
], SkillAction.prototype, "isRoleAction", void 0);
__decorate([
    Offset(7),
    __metadata("design:type", Boolean)
], SkillAction.prototype, "isPlayerAction", void 0);
__decorate([
    Offset(8),
    __metadata("design:type", Boolean)
], SkillAction.prototype, "isPvP", void 0);
SkillAction = __decorate([
    ModelStruct('SkillAction')
], SkillAction);
export { SkillAction };
//# sourceMappingURL=SkillAction.js.map
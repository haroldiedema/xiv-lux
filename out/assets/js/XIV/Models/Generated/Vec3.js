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
let Vec3 = class Vec3 {
};
__decorate([
    Offset(0),
    __metadata("design:type", Number)
], Vec3.prototype, "x", void 0);
__decorate([
    Offset(1),
    __metadata("design:type", Number)
], Vec3.prototype, "y", void 0);
__decorate([
    Offset(2),
    __metadata("design:type", Number)
], Vec3.prototype, "z", void 0);
Vec3 = __decorate([
    ModelStruct('Vec3')
], Vec3);
export { Vec3 };
//# sourceMappingURL=Vec3.js.map
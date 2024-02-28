/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Vec2_1;
import { ModelExtension } from "@/System/Serializer/ModelExtension";
import { Vec2 as GeneratedVec2 } from "@/XIV/Models/Generated/Vec2";
let Vec2 = Vec2_1 = class Vec2 extends GeneratedVec2 {
    constructor(x = 0, y = 0, mutable = false) {
        super();
        this.mutable = mutable;
        this.x = x;
        this.y = y;
    }
    add(other) {
        if (this.mutable) {
            this.x += other.x;
            this.y += other.y;
            return this;
        }
        return new Vec2_1(this.x + other.x, this.y + other.y);
    }
    addScalar(scalar) {
        if (this.mutable) {
            this.x += scalar;
            this.y += scalar;
            return this;
        }
        return new Vec2_1(this.x + scalar, this.y + scalar);
    }
    subtract(other) {
        if (this.mutable) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        }
        return new Vec2_1(this.x - other.x, this.y - other.y);
    }
    subtractScalar(scalar) {
        if (this.mutable) {
            this.x -= scalar;
            this.y -= scalar;
            return this;
        }
        return new Vec2_1(this.x - scalar, this.y - scalar);
    }
    multiply(other) {
        if (this.mutable) {
            this.x *= other.x;
            this.y *= other.y;
            return this;
        }
        return new Vec2_1(this.x * other.x, this.y * other.y);
    }
    multiplyScalar(scalar) {
        if (this.mutable) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }
        return new Vec2_1(this.x * scalar, this.y * scalar);
    }
    divide(other) {
        if (this.mutable) {
            this.x /= other.x;
            this.y /= other.y;
            return this;
        }
        return new Vec2_1(this.x / other.x, this.y / other.y);
    }
    divideScalar(scalar) {
        if (this.mutable) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }
        return new Vec2_1(this.x / scalar, this.y / scalar);
    }
    distanceTo(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const len = this.length();
        if (this.mutable) {
            this.x /= len;
            this.y /= len;
            return this;
        }
        return new Vec2_1(this.x / len, this.y / len);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    angleTo(other) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }
    clone() {
        return new Vec2_1(this.x, this.y, false);
    }
    mut() {
        return new Vec2_1(this.x, this.y, true);
    }
    set(x, y) {
        if (this.mutable) {
            this.x = x;
            this.y = y;
            return this;
        }
        return new Vec2_1(x, y);
    }
    copyFrom(other) {
        if (this.mutable) {
            this.x = other.x;
            this.y = other.y;
            return this;
        }
        return new Vec2_1(other.x, other.y);
    }
    lerp(other, alpha) {
        if (this.mutable) {
            this.x += (other.x - this.x) * alpha;
            this.y += (other.y - this.y) * alpha;
            return this;
        }
        return new Vec2_1(this.x + (other.x - this.x) * alpha, this.y + (other.y - this.y) * alpha);
    }
    clamp(minX, minY, maxX, maxY) {
        if (this.mutable) {
            this.x = Math.max(minX, Math.min(maxX, this.x));
            this.y = Math.max(minY, Math.min(maxY, this.y));
            return this;
        }
        return new Vec2_1(Math.max(minX, Math.min(maxX, this.x)), Math.max(minY, Math.min(maxY, this.y)));
    }
    toMapCoordinates(zone) {
        return new Vec2_1(this.x / zone.sizeFactor * 2.0 + 1, this.y / zone.sizeFactor * 2.0 + 1);
    }
    toWorldCoordinates(zone) {
        return new Vec2_1(((this.x - 1024) / zone.sizeFactor * 100.0) - zone.offset.x, ((this.y - 1024) / zone.sizeFactor * 100.0) - zone.offset.y);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
};
Vec2 = Vec2_1 = __decorate([
    ModelExtension('Vec2'),
    __metadata("design:paramtypes", [Number, Number, Boolean])
], Vec2);
export { Vec2 };
//# sourceMappingURL=Vec2.js.map
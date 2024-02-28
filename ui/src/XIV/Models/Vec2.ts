/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { ModelExtension } from "@/System/Serializer/ModelExtension";
import { Vec2 as GeneratedVec2 } from "@/XIV/Models/Generated/Vec2";
import { Zone } from "@/XIV/Models/Generated/Zone";

@ModelExtension('Vec2')
export class Vec2 extends GeneratedVec2
{
    constructor(x: number = 0, y: number = 0, private readonly mutable: boolean = false)
    {
        super();

        this.x = x;
        this.y = y;
    }

    public add(other: Vec2): Vec2
    {
        if (this.mutable) {
            this.x += other.x;
            this.y += other.y;

            return this;
        }

        return new Vec2(this.x + other.x, this.y + other.y);
    }

    public addScalar(scalar: number): Vec2
    {
        if (this.mutable) {
            this.x += scalar;
            this.y += scalar;

            return this;
        }

        return new Vec2(this.x + scalar, this.y + scalar);
    }

    public subtract(other: Vec2): Vec2
    {
        if (this.mutable) {
            this.x -= other.x;
            this.y -= other.y;

            return this;
        }

        return new Vec2(this.x - other.x, this.y - other.y);
    }

    public subtractScalar(scalar: number): Vec2
    {
        if (this.mutable) {
            this.x -= scalar;
            this.y -= scalar;

            return this;
        }

        return new Vec2(this.x - scalar, this.y - scalar);
    }

    public multiply(other: Vec2): Vec2
    {
        if (this.mutable) {
            this.x *= other.x;
            this.y *= other.y;

            return this;
        }

        return new Vec2(this.x * other.x, this.y * other.y);
    }

    public multiplyScalar(scalar: number): Vec2
    {
        if (this.mutable) {
            this.x *= scalar;
            this.y *= scalar;

            return this;
        }

        return new Vec2(this.x * scalar, this.y * scalar);
    }

    public divide(other: Vec2): Vec2
    {
        if (this.mutable) {
            this.x /= other.x;
            this.y /= other.y;

            return this;
        }

        return new Vec2(this.x / other.x, this.y / other.y);
    }

    public divideScalar(scalar: number): Vec2
    {
        if (this.mutable) {
            this.x /= scalar;
            this.y /= scalar;

            return this;
        }

        return new Vec2(this.x / scalar, this.y / scalar);
    }

    public distanceTo(other: Vec2): number
    {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    public length(): number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize(): Vec2
    {
        const len = this.length();

        if (this.mutable) {
            this.x /= len;
            this.y /= len;

            return this;
        }

        return new Vec2(this.x / len, this.y / len);
    }

    public dot(other: Vec2): number
    {
        return this.x * other.x + this.y * other.y;
    }

    public angleTo(other: Vec2): number
    {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }

    public clone(): Vec2
    {
        return new Vec2(this.x, this.y, false);
    }

    public mut(): Vec2
    {
        return new Vec2(this.x, this.y, true);
    }

    public set(x: number, y: number): Vec2
    {
        if (this.mutable) {
            this.x = x;
            this.y = y;

            return this;
        }

        return new Vec2(x, y);
    }

    public copyFrom(other: Vec2): Vec2
    {
        if (this.mutable) {
            this.x = other.x;
            this.y = other.y;

            return this;
        }

        return new Vec2(other.x, other.y);
    }

    public lerp(other: Vec2, alpha: number): Vec2
    {
        if (this.mutable) {
            this.x += (other.x - this.x) * alpha;
            this.y += (other.y - this.y) * alpha;

            return this;
        }

        return new Vec2(
            this.x + (other.x - this.x) * alpha,
            this.y + (other.y - this.y) * alpha
        );
    }

    public clamp(minX: number, minY: number, maxX: number, maxY: number): Vec2
    {
        if (this.mutable) {
            this.x = Math.max(minX, Math.min(maxX, this.x));
            this.y = Math.max(minY, Math.min(maxY, this.y));

            return this;
        }

        return new Vec2(
            Math.max(minX, Math.min(maxX, this.x)),
            Math.max(minY, Math.min(maxY, this.y))
        );
    }

    public toMapCoordinates(zone: Zone): Vec2
    {
        return new Vec2(
            this.x / zone.sizeFactor * 2.0 + 1,
            this.y / zone.sizeFactor * 2.0 + 1
        );
    }

    public toWorldCoordinates(zone: Zone): Vec2
    {
        return new Vec2(
            ((this.x - 1024) / zone.sizeFactor * 100.0) - zone.offset.x,
            ((this.y - 1024) / zone.sizeFactor * 100.0) - zone.offset.y
        );
    }

    public override toString(): string
    {
        return `(${this.x}, ${this.y})`;
    }
}

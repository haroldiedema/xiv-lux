/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';

@ModelStruct('Vec3')
export class Vec3
{
    @Offset(0)
    public readonly x: number;

    @Offset(1)
    public readonly y: number;

    @Offset(2)
    public readonly z: number;
}
/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';

@ModelStruct('Vec2')
export class Vec2
{
    @Offset(0)
    public x: number;

    @Offset(1)
    public y: number;
}
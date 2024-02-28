/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';
import { Vec2 } from '@/XIV/Models/Vec2';

@ModelStruct('HousingMarker')
export class HousingMarker
{
    @Offset(0)
    public readonly iconId: number;

    @Offset(1)
    public readonly mapId: number;

    @Offset(2)
    public readonly name: string;

    @Offset(3)
    public readonly position: Vec2;
}
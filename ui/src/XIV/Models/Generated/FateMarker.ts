/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';
import { FateStateKind } from '@/XIV/Models/Generated/FateStateKind';
import { Vec2 } from '@/XIV/Models/Vec2';

@ModelStruct('FateMarker')
export class FateMarker
{
    @Offset(0)
    public readonly state: FateStateKind;

    @Offset(1)
    public readonly iconId: number;

    @Offset(2)
    public readonly name: string;

    @Offset(3)
    public readonly description: string;

    @Offset(4)
    public readonly objective: string;

    @Offset(5)
    public readonly startTimeEpoch: number;

    @Offset(6)
    public readonly duration: number;

    @Offset(7)
    public readonly progress: number;

    @Offset(8)
    public readonly radius: number;

    @Offset(9)
    public readonly level: number;

    @Offset(10)
    public readonly maxLevel: number;

    @Offset(11)
    public readonly position: Vec2;

    @Offset(12)
    public readonly isExpBonus: boolean;

    @Offset(13)
    public readonly handInCount: number;
}
/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';
import { Gearset } from '@/XIV/Models/Generated/Gearset';

@ModelStruct('GearsetState')
export class GearsetState
{
    @Offset(0)
    public readonly currentIndex: number;

    @Offset(1)
    public readonly gearsets: Gearset[];
}

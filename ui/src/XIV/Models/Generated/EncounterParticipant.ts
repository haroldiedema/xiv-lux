/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';

@ModelStruct('EncounterParticipant')
export class EncounterParticipant
{
    @Offset(0)
    public readonly id: string;

    @Offset(1)
    public readonly name: string;

    @Offset(2)
    public readonly jobId: number;

    @Offset(3)
    public readonly damageDone: number;

    @Offset(4)
    public readonly dPS: number;

    @Offset(5)
    public readonly duration: number;
}

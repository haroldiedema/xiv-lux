/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';
import { EncounterState } from '@/XIV/Models/Generated/EncounterState';
import { EncounterParticipant } from '@/XIV/Models/Generated/EncounterParticipant';

@ModelStruct('Encounter')
export class Encounter
{
    @Offset(0)
    public readonly state: EncounterState;

    @Offset(1)
    public readonly participants: EncounterParticipant[];
}
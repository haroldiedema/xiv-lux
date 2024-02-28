/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';

@ModelStruct('GameState')
export class GameState
{
    @Offset(0)
    public readonly isLoggedIn: boolean;

    @Offset(1)
    public readonly playerId: string;

    @Offset(2)
    public readonly zoneId?: number;

    @Offset(3)
    public readonly isOccupied: boolean;

    @Offset(4)
    public readonly isInCutscene: boolean;

    @Offset(5)
    public readonly isBetweenAreas: boolean;

    @Offset(6)
    public readonly isMounted: boolean;

    @Offset(7)
    public readonly isFlying: boolean;

    @Offset(8)
    public readonly isInDuty: boolean;

    @Offset(9)
    public readonly isInCombat: boolean;

    @Offset(10)
    public readonly isInParty: boolean;
}
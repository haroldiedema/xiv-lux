/* This file was generated by Lux. Do not modify. */

import { Offset, ModelStruct } from '@/System/Serializer';
import { Vec2 } from '@/XIV/Models/Vec2';
import { ZoneReference } from '@/XIV/Models/Generated/ZoneReference';
import { StaticMarker } from '@/XIV/Models/StaticMarker';

@ModelStruct('Zone')
export class Zone
{
    @Offset(0)
    public readonly id: number;

    @Offset(1)
    public readonly territoryId: number;

    @Offset(2)
    public readonly placeName: string;

    @Offset(3)
    public readonly placeNameSub: string;

    @Offset(4)
    public readonly regionName: string;

    @Offset(5)
    public readonly weatherRate: number;

    @Offset(6)
    public readonly texturePath: string;

    @Offset(7)
    public readonly sizeFactor: number;

    @Offset(8)
    public readonly offset: Vec2;

    @Offset(9)
    public readonly parentZone: ZoneReference;

    @Offset(10)
    public readonly regionZone: ZoneReference;

    @Offset(11)
    public readonly staticMarkers: StaticMarker[];

    @Offset(12)
    public readonly adjecentZoneChain: any;

    @Offset(13)
    public readonly layers: ZoneReference[];
}

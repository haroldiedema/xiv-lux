  /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record Zone
{
    [Offset(0)] public uint Id;
    [Offset(1)] public uint TerritoryId;
    [Offset(2)] public string PlaceName    = string.Empty;
    [Offset(3)] public string PlaceNameSub = string.Empty;
    [Offset(4)] public string RegionName   = string.Empty;
    [Offset(5)] public uint WeatherRate;
    [Offset(6)] public string? TexturePath;
    [Offset(7)] public float SizeFactor;
    [Offset(8)] public Vec2 Offset = new();
    [Offset(9)] public ZoneReference? ParentZone;
    [Offset(10)] public ZoneReference? RegionZone;
    [Offset(11)] public List<StaticMarker> StaticMarkers = [];
    [Offset(12)] public Dictionary<uint, List<uint>> AdjecentZoneChain = [];
    [Offset(13)] public List<ZoneReference> Layers = [];
}

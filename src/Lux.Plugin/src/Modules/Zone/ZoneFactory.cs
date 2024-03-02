/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Plugin.Services;
using Dalamud.Utility;
using FFXIVClientStructs.FFXIV.Client.UI.Agent;
using Lumina.Data.Files;
using Lumina.Excel.GeneratedSheets;
using Lux.Common.Model;
using Lux.Models;

namespace Lux;

[Service]
internal sealed class ZoneFactory(ModelSerializer serializer, IDataManager dataManager)
{
    private readonly ModelSerializer Serializer = serializer;
    private readonly IDataManager DataManager   = dataManager;

    public Zone Make(uint mapId)
    {
        var map = ExcelSheet<Map>.Find(mapId) ?? throw new KeyNotFoundException($"Map {mapId} not found.");
        var zone = new Zone {
            Id            = mapId,
            TerritoryId   = map.TerritoryType.Value?.RowId ?? 0,
            PlaceName     = map.PlaceName.Value?.Name.ToDalamudString().TextValue ?? "",
            PlaceNameSub  = map.PlaceNameSub.Value?.Name.ToDalamudString().TextValue ?? "",
            RegionName    = map.PlaceNameRegion.Value?.Name.ToDalamudString().TextValue ?? "",
            WeatherRate   = map.TerritoryType.Value?.WeatherRate ?? 0,
            TexturePath   = GetTexturePath(map),
            SizeFactor    = map.SizeFactor,
            Offset        = new Vec2 { X = map.OffsetX, Y = map.OffsetY },
            ParentZone    = GetParentZoneReference(map),
            RegionZone    = GetRegionZoneReference(map),
            StaticMarkers = GetStaticMarkers(map),
            Layers        = GetZoneLayers(map),
        };

        Logger.Info($"ZoneFactory: Created zone {zone.PlaceName} (ID: {zone.Id}) - Offset: {zone.Offset.X}, {zone.Offset.Y}");

        return zone;
    }

    private List<ZoneReference> GetZoneLayers(Map map)
    {
        var layers = new List<ZoneReference>();
        var maps = ExcelSheet<Map>.All
            .Where(m => m.PlaceName.Row == map.PlaceName.Row && m.MapIndex != 0)
            .OrderBy(m => m.MapIndex);

        foreach (var layer in maps) {
            layers.Add(new ZoneReference {
                Id           = layer.RowId,
                PlaceName    = layer.PlaceName.Value?.Name.ToDalamudString().TextValue ?? "",
                PlaceNameSub = layer.PlaceNameSub.Value?.Name.ToDalamudString().TextValue ?? "",
                RegionName   = layer.PlaceNameRegion.Value?.Name.ToDalamudString().TextValue ?? "",
            });
        }

        return layers;
    }

    private string? GetTexturePath(Map map)
    {
        string rawId    = map.Id.RawString;
        string fileName = $"ui/map/{rawId}/{rawId.Replace("/", "")}_m.tex";
        
        return DataManager.FileExists(fileName) ? fileName : null;
    }

    private static ZoneReference? GetParentZoneReference(Map map)
    {
        if (map.Id.RawString.Split('/') is [_, _] idSplit) {
            var index     = int.Parse(idSplit[1]);
            var parentMap = ExcelSheet<Map>.All.FirstOrDefault(map => map.Id.RawString == $"{idSplit[0]}/{index - 1:D2}");

            if (parentMap != null) {
                return new ZoneReference {
                    Id           = parentMap.RowId,
                    PlaceName    = parentMap.PlaceName.Value?.Name.ToDalamudString().TextValue ?? "",
                    PlaceNameSub = parentMap.PlaceNameSub.Value?.Name.ToDalamudString().TextValue ?? "",
                    RegionName   = parentMap.PlaceNameRegion.Value?.Name.ToDalamudString().TextValue ?? "",
                };
            }
        }

        return null;
    }

    private static ZoneReference? GetRegionZoneReference(Map map)
    {
        if (map is not { PlaceNameRegion.Row: var currentMapRegion }) return null;
        if (ExcelSheet<Map>.All.FirstOrDefault(map => map.PlaceName.Row == currentMapRegion) is not { } targetMap) return null;
        if (targetMap == map) return null;

        return new ZoneReference {
            Id           = targetMap.RowId,
            PlaceName    = targetMap.PlaceName.Value?.Name.ToDalamudString().TextValue ?? "",
            PlaceNameSub = targetMap.PlaceNameSub.Value?.Name.ToDalamudString().TextValue ?? "",
            RegionName   = targetMap.PlaceNameRegion.Value?.Name.ToDalamudString().TextValue ?? "",
        };
    }

    public static List<StaticMarker> GetStaticMarkers(Map map)
    {
        var markers = new List<StaticMarker>();

        foreach (var marker in ExcelSheet<MapMarker>.All.Where(m => m.RowId == map.MapMarkerRange && m.X > 0 && m.Y > 0)) {
            var metadata = new Dictionary<string, object?>
            {
                ["DataType"] = marker.DataType,
                ["DataKey"] = marker.DataKey
            };

            switch ((StaticMarkerKind)marker.DataType) {
                case StaticMarkerKind.Aetheryte: 
                    metadata["AetheryteId"] = marker.DataKey;
                    break;
                case StaticMarkerKind.MapLink: 
                    metadata["TargetMapId"] = marker.DataKey;
                    metadata["AdjecentZones"] = GetAdjecentZoneIdList(marker.DataKey, [map.RowId]);
                    break;
                case StaticMarkerKind.InstanceLink:
                    metadata["TargetInstanceId"] = marker.DataKey;
                    break;
            }

            markers.Add(new StaticMarker {
                Kind     = (StaticMarkerKind) marker.DataType,
                Name     = GetStaticMarkerLabel(marker),
                IconId   = marker.Icon,
                Position = Vec2.FromVector2(new System.Numerics.Vector2(marker.X, marker.Y)),
                metadata = metadata,
            });
        }

        // Add Eureka treasure coffer locations.
        if (EurekaCoffers.Positions.TryGetValue(map.TerritoryType.Row, out List<System.Numerics.Vector3>? positions)) {
            foreach (var position in positions) {
                markers.Add(new StaticMarker {
                    Kind     = StaticMarkerKind.Standard,
                    Name     = "",
                    IconId   = 60356,
                    Position = Vec2.FromWorldPosition(position, map),
                    metadata = new Dictionary<string, object?>
                    {
                        ["IsEurekaCoffer"] = 1,
                    },
                });
            }
        }

        return markers;
    }

    private static List<uint> GetAdjecentZoneIdList(uint mapId, List<uint> chain)
    {
        if (! chain.Contains(mapId)) chain.Add(mapId);

        var map = ExcelSheet<Map>.Find(mapId);
        if (map == null) return chain;

        if (chain.Count > 2) return chain;

        foreach (var marker in ExcelSheet<MapMarker>.All.Where(m => m.RowId == map.MapMarkerRange && m.X > 0 && m.Y > 0)) {
            if (marker.DataType != (byte)StaticMarkerKind.MapLink) continue;
            if (marker.DataKey == mapId) continue;
            if (chain.Contains(marker.DataKey)) continue;

            chain.Add(marker.DataKey);
            chain = GetAdjecentZoneIdList(marker.DataKey, chain);
        };

        return chain;
    }

    private static string GetStaticMarkerLabel(MapMarker marker)
    {
        var label = marker.PlaceNameSubtext.Value?.Name.ToDalamudString().TextValue ?? "";
        if (!string.IsNullOrEmpty(label)) return label;
        if (marker.Icon == 0) return "";

        if (marker.DataType == (byte)StaticMarkerKind.Aethernet) {
            var placeName = ExcelSheet<PlaceName>.Find(marker.DataKey);
            if (placeName != null) return placeName.Name.ToDalamudString().TextValue;
        }

        var symbol = ExcelSheet<MapSymbol>.Find(marker.Icon);
        if (symbol == null) return "";

        return symbol.PlaceName.Value?.Name.ToDalamudString().TextValue ?? "";
    }
}

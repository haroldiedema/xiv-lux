/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using FFXIVClientStructs.FFXIV.Client.Game.UI;
using Lumina.Excel.GeneratedSheets;
using Lux.Models;
using NativeHousingManager = FFXIVClientStructs.FFXIV.Client.Game.Housing.HousingManager;

namespace Lux;

[Service]
internal unsafe sealed class HousingManager(ZoneManager zoneManager)
{
    public List<HousingMarker> GetHousingMarkers()
    {
        List<HousingMarker> markers = [];
        if (null == zoneManager.SelectedZone) return markers;
        if (!IsHousingManagerValid()) return markers;

        var districtId = GetHousingDistrictId(zoneManager.SelectedZone.Id);
        if (uint.MaxValue == districtId) return markers;

        var landSet = GetHousingLandSet(districtId);
        if (landSet is null) return markers;

        var housingMarkers = ExcelSheet<HousingMapMarkerInfo>.All.Where(info => info.Map.Row == zoneManager.SelectedZone.Id);

        foreach (var housingMarker in housingMarkers) {
            var marker = new HousingMarker {
                IconId = GetHousingIcon(landSet, housingMarker.SubRowId),
                Position = Vec2.FromWorldPosition(new System.Numerics.Vector3(housingMarker.X, housingMarker.Y, housingMarker.Z), zoneManager.SelectedZone),
            };

            markers.Add(marker);
        }

        return markers;
    }

    private uint GetHousingIcon(HousingLandSet landSet, uint subRowId)
    {
        if (landSet is not {} housingSizeInfo) return 0;
        var manager = GetHousingManager();

        return subRowId switch {
            60 when IsHousingManagerValid() => (uint) manager->OutdoorTerritory->GetPlotIcon(128),
            61 when IsHousingManagerValid() => (uint) manager->OutdoorTerritory->GetPlotIcon(129),
            _  when IsHousingManagerValid() => (uint) manager->OutdoorTerritory->GetPlotIcon((byte) subRowId),
                
            60 when !IsHousingManagerValid() => 60789,
            61 when !IsHousingManagerValid() => 60789,
            _ when !IsHousingManagerValid() => housingSizeInfo.PlotSize[subRowId] switch {
                0 => 60754, // Small House
                1 => 60755, // Medium House
                2 => 60756, // Large House
                _ => 60750  // Housing Placeholder Marker
            },
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private static NativeHousingManager* GetHousingManager()
    {
        return NativeHousingManager.Instance();
    }

    private bool IsHousingManagerValid()
    {
        return GetHousingManager() != null && GetHousingManager()->OutdoorTerritory != null;
    }

    private static HousingLandSet? GetHousingLandSet(uint districtId) => ExcelSheet<HousingLandSet>.Find(districtId);

    private static uint GetHousingDistrictId(uint mapId) => mapId switch {
        72 or 192 => 0,
        82 or 193 => 1,
        83 or 194 => 2,
        364 or 365 => 3,
        679 or 680 => 4,
        _ => uint.MaxValue,
    };
}

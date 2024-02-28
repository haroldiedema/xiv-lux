/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using FFXIVClientStructs.FFXIV.Client.Game.UI;
using FFXIVClientStructs.FFXIV.Client.UI.Agent;
using Lux.Models;
using Lux.Server.Configuration;

namespace Lux.Controllers;

[Controller]
internal unsafe sealed class ZoneController(ZoneManager zoneManager, FateManager fateManager)
{
    private readonly List<Lumina.Excel.GeneratedSheets.FieldMarker> fieldMarkers = ExcelSheet<Lumina.Excel.GeneratedSheets.FieldMarker>.All.Where(marker => marker.MapIcon is not 0).ToList();

    [WebSocketCommand]
    public Zone? GetZone(uint mapId)
    {
        return zoneManager.GetZone(mapId);
    }

    [WebSocketCommand]
    public unsafe void SetSelectedZone(uint mapId)
    {
        zoneManager.SetSelectedZone(mapId);
    }

    [WebSocketEventStream("CurrentZone", 4)]
    public Zone? StreamCurrentZone()
    {
        return zoneManager.CurrentZone;
    }

    [WebSocketEventStream("SelectedZone", 4)]
    public Zone? StreamSelectedZone()
    {
        return zoneManager.SelectedZone;
    }

    [WebSocketCommand]
    public void SetFlagMarker(uint mapId, uint territoryId, float x, float y)
    {
        zoneManager.SetFlagMarker(mapId, territoryId, x, y, null);
    }

    [WebSocketCommand]
    public void RemoveFlagMarker()
    {
        zoneManager.ResetFlagMarker();
    }
    
    [WebSocketEventStream("FlagMarker", 10)]
    public unsafe FlagMarker? StreamFlagMarker()
    {
        var agent = AgentMap.Instance();
        if (agent == null) return null;

        if (0 == agent->IsFlagMarkerSet) {
            return null;
        }

        return new FlagMarker {
            IconId      = agent->FlagMapMarker.MapMarker.IconId,
            MapId       = agent->FlagMapMarker.MapId,
            TerritoryId = agent->FlagMapMarker.TerritoryId,
            Position    = new Vec2 { 
                X = agent->FlagMapMarker.XFloat + 1024f, 
                Y = agent->FlagMapMarker.YFloat + 1024f, 
            }
        };
    }

    [WebSocketEventStream("Waymarks", 2)]
    public List<WaymarkMarker> StreamWaymarks()
    {
        List<WaymarkMarker> markers = [];
        if (zoneManager.CurrentZone?.Id != zoneManager.SelectedZone?.Id) return markers;

        MarkingController* markingController = MarkingController.Instance();
        if (markingController == null) return markers;

        var markerSpan = markingController->FieldMarkerArraySpan;

        foreach (var index in Enumerable.Range(0, 8)) {
            if (markerSpan[index] is { Active: true } marker) {
                markers.Add(new WaymarkMarker {
                    IconId  = fieldMarkers[index].MapIcon,
                    Position = new Vec2{
                        X = (marker.X / 1000f) + 1024f,
                        Y = (marker.Z / 1000f) + 1024f,
                    },
                });
            }
        }

        return markers;
    }

    [WebSocketEventStream("Fates", 2)]
    public List<FateMarker> StreamFates()
    {
        return fateManager.GetFateMarkers();
    }
}

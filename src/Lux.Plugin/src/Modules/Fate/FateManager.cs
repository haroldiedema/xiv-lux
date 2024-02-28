/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using FFXIVClientStructs.FFXIV.Client.Game.Fate;
using Lux;
using Lux.Models;

[Service]
internal unsafe sealed class FateManager(ZoneManager zoneManager)
{
    public List<FateMarker> GetFateMarkers()
    {
        if (null == zoneManager.CurrentZone) return [];
        if (zoneManager.SelectedZone?.Id != zoneManager.CurrentZone.Id) return [];

        List<FateMarker> markers = [];

        foreach (FateContext* fate in FFXIVClientStructs.FFXIV.Client.Game.Fate.FateManager.Instance()->Fates.Span) {
            if (fate is null) continue;

            markers.Add(new FateMarker {
                State = (FateStateKind)fate->State,
                IconId = fate->MapIconId,
                Name = fate->Name.ToString(),
                Description = fate->Description.ToString(),
                Objective = fate->Objective.ToString(),
                StartTimeEpoch = fate->StartTimeEpoch,
                Duration = fate->Duration,
                Progress = fate->Progress,
                Radius = fate->Radius,
                Level = fate->Level,
                MaxLevel = fate->MaxLevel,
                Position = Vec2.FromWorldPosition(fate->Location, zoneManager.CurrentZone),
                IsExpBonus = fate->IsExpBonus,
                HandInCount = fate->HandInCount,
            });
        }

        return markers;
    }
}
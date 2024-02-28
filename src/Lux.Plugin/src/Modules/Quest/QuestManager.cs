/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using FFXIVClientStructs.FFXIV.Client.UI.Agent;
using Lux.Models;

namespace Lux;

[Service]
internal unsafe sealed class QuestManager(QuestRepository repository, ZoneManager zoneManager)
{
    public List<QuestMarker> GetUnacceptedQuestMarkers()
    {
        List<QuestMarker> markers = [];

        var mapData = FFXIVClientStructs.FFXIV.Client.Game.UI.Map.Instance();
        if (null == mapData) return markers;

        foreach (var marker in mapData->UnacceptedQuests.GetEnumerator()) {
            foreach (var data in marker.MarkerData.Span) {
                var zone = zoneManager.GetZone(data.MapId);
                if (null == zone || 0 >= data.ObjectiveId) continue;

                markers.Add(new QuestMarker {
                    Kind = QuestMarkerKind.Unaccepted,
                    QuestId = data.ObjectiveId,
                    IconId = data.IconId,
                    MapId = data.MapId,
                    Position = Vec2.FromWorldPosition(new System.Numerics.Vector3(data.X, data.Y, data.Z), zone),
                    Quest = Quest.FromQuestRow(repository.FindById(data.ObjectiveId)!),
                });
            }
        }

        return markers;
    }

    public List<QuestMarker> GetAcceptedQuestMarkers()
    {
        List<QuestMarker> markers = [];

        var mapData = FFXIVClientStructs.FFXIV.Client.Game.UI.Map.Instance();
        if (null == mapData) return markers;

        foreach (var marker in mapData->QuestDataSpan) {
            foreach (var data in marker.MarkerData.Span) {
                var zone = zoneManager.GetZone(data.MapId);
                if (null == zone) continue;

                var quest = repository.FindActiveByName(marker.Label.ToString());
                if (null == quest) continue;

                var iconId = data.IconId;
                if (iconId >= 60490 && iconId <= 60499) iconId = 0;

                markers.Add(new QuestMarker {
                    Kind = QuestMarkerKind.Accepted,
                    QuestId = quest.RowId - 65535u,
                    IconId = iconId,
                    MapId = data.MapId,
                    Radius = data.Radius,
                    Position = Vec2.FromWorldPosition(new System.Numerics.Vector3(data.X, data.Y, data.Z), zone),
                    Quest = Quest.FromQuestRow(quest),
                });
            }
        }

        return markers;
    }

    public List<QuestMarker> GetQuestLinkMarkers()
    {
        var markers = new List<QuestMarker>();
        var questLinkSpan = new ReadOnlySpan<FFXIVClientStructs.FFXIV.Client.UI.Agent.QuestLinkMarker>(
            AgentMap.Instance()->MiniMapQuestLinkContainer.Markers, 
            AgentMap.Instance()->MiniMapQuestLinkContainer.MarkerCount
        );

        foreach (var marker in questLinkSpan) {
            var level = ExcelSheet<Lumina.Excel.GeneratedSheets.Level>.Find(marker.LevelId);
            if (null == level) continue;

            markers.Add(new QuestMarker {
                Kind = QuestMarkerKind.MapLink,
                QuestId = marker.QuestId,
                IconId = marker.IconId,
                MapId = marker.SourceMapId,
                TargetMapId = marker.TargetMapId,
                Position = Vec2.FromWorldPosition(new System.Numerics.Vector3(level.X, level.Y, level.Z), zoneManager.GetZone(marker.SourceMapId)!),
                Quest = Quest.FromQuestRow(repository.FindById(marker.QuestId)!),
            });
        }

        return markers;
    }
}

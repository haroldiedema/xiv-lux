/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Numerics;
using Dalamud.Plugin;
using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Client.UI.Agent;
using Lux.Models;

namespace Lux;

[Service]
internal sealed class QuestMarkerRenderer : IDisposable
{
    private readonly DalamudPluginInterface Plugin;
    private readonly QuestManager QuestManager;
    private readonly WorldMarkerRenderer Renderer;
    private readonly ZoneManager ZoneManager;
    private readonly Dictionary<string, WorldMarker> WorldMarkers = [];

    public QuestMarkerRenderer(
        DalamudPluginInterface plugin, 
        WorldMarkerRenderer renderer, 
        QuestManager qm,
        ZoneManager zm
    )
    {
        Plugin = plugin;
        QuestManager = qm;
        Renderer = renderer;
        ZoneManager = zm;

        plugin.UiBuilder.Draw += OnDraw;
    }

    public void Dispose()
    {
        Plugin.UiBuilder.Draw -= OnDraw;
    }

    private unsafe void OnDraw()
    {
        var markers = QuestManager.GetAcceptedQuestMarkers().Where(m => m.MapId == ZoneManager.CurrentZone?.Id).ToList();

        if (markers.Count == 0) {
            RemoveAllMarkers();
            return;
        }

        foreach (var marker in markers) {
            var hash = $"{marker.QuestId}:{marker.Position.X}:{marker.Position.Y}";

            if (false == WorldMarkers.ContainsKey(hash)) {
                var wm = new WorldMarker(
                    hash,
                    marker.Quest!.Name,
                    marker.IconId > 0 ? marker.IconId : 61560,
                    new Vector2(marker.WorldPosition.X, marker.WorldPosition.Z),
                    new Vector3(marker.WorldPosition.X, marker.WorldPosition.Y, marker.WorldPosition.Z),
                    true
                );

                WorldMarkers[hash] = wm;
                Renderer.AddMarker(wm);
            }
        }

        var toRemove = WorldMarkers.Keys.Except(markers.Select(m => $"{m.QuestId}:{m.Position.X}:{m.Position.Y}")).ToList();
        foreach (var key in toRemove) {
            Renderer.RemoveMarker(WorldMarkers[key]);
            WorldMarkers.Remove(key);
        }
    }

    private void RemoveAllMarkers()
    {
        foreach (var marker in WorldMarkers.Values) {
            Renderer.RemoveMarker(marker);
        }

        WorldMarkers.Clear();
    }
}

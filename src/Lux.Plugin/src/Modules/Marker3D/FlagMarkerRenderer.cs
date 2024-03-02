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

namespace Lux;

[Service]
internal sealed class FlagMarkerRenderer : IDisposable
{
    private readonly DalamudPluginInterface Plugin;
    private readonly IClientState ClientState;
    private readonly WorldMarkerRenderer Renderer;
    private readonly ZoneManager ZoneManager;

    private WorldMarker? flagMarker = null;

    public FlagMarkerRenderer(DalamudPluginInterface plugin, IClientState cs, WorldMarkerRenderer renderer, ZoneManager zm)
    {
        Plugin = plugin;
        ClientState = cs;
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
        if (null == ClientState.LocalPlayer) return;

        var agent = AgentMap.Instance();
        if (agent == null) return;

        if (0 == agent->IsFlagMarkerSet || agent->FlagMapMarker.MapId != ZoneManager.CurrentZone?.Id) {
            if (flagMarker != null) {
                Renderer.RemoveMarker(flagMarker);
                flagMarker = null;
            }

            return;
        }
        var marker = agent->FlagMapMarker;

        if (flagMarker == null) {
            flagMarker = new WorldMarker(
                "flag",
                "Flag",
                marker.MapMarker.IconId,
                new Vector2(marker.XFloat, marker.YFloat)
            );

            Renderer.AddMarker(flagMarker);
            return;
        }

        flagMarker.Position.X = marker.XFloat;
        flagMarker.Position.Y = marker.YFloat;
    }
}

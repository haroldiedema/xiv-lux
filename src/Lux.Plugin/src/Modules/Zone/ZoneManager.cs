/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Hooking;
using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Client.System.String;
using FFXIVClientStructs.FFXIV.Client.UI.Agent;
using FFXIVClientStructs.FFXIV.Component.GUI;
using Lux.Models;

namespace Lux;

[Service] internal sealed unsafe class ZoneManager : IUpdatable, IDisposable
{
    public Zone? CurrentZone { get; private set; }
    public Zone? SelectedZone { get; private set; }

    public event ZoneChangedDelegate? OnCurrentZoneChanged;
    public event ZoneChangedDelegate? OnSelectedZoneChanged;

    public bool AllowNativeWorldMap { get; set; } = false;

    private readonly GameStateManager gameStateManager;
    private readonly ZoneCache Cache;

    public ZoneManager(GameStateManager _gsm, ZoneCache _cache)
    {
        gameStateManager = _gsm;
        Cache = _cache;
    }

    public void Dispose()
    {
    }

    public Zone? GetZone(uint mapId)
    {
        return Cache.GetZone(mapId);
    }

    public void SetSelectedZone(uint mapId)
    {
        var agent = AgentMap.Instance();
        if (agent == null) return;

        agent->OpenMapByMapId(mapId);
    }

    public void SetFlagMarker(uint mapId, uint territoryId, float mapX, float mapY, uint? iconId)
    {
        var agent = AgentMap.Instance();
        if (agent == null) return;

        agent->IsFlagMarkerSet = 0;
        agent->SetFlagMapMarker(territoryId, mapId, mapX - 1024f, mapY - 1024f, iconId ?? 60561);

        if (mapId == SelectedZone?.Id) {
            OnSelectedZoneChanged?.Invoke(SelectedZone, SelectedZone);
        }

        AgentChatLog* chatLog = AgentChatLog.Instance();
        if (chatLog == null) return;

        chatLog->InsertTextCommandParam(1048, false);
    }

    public void ResetFlagMarker()
    {
        var agent = AgentMap.Instance();
        if (agent == null) return;

        agent->IsFlagMarkerSet = 0;
    }

    public Dictionary<uint, List<uint>> GetAdjecentZoneIdChain(uint mapId)
    {
        Dictionary<uint, List<uint>> result = [];
        var zone = Cache.GetZone(mapId);
        if (zone == null) return result;

        zone.StaticMarkers.Where(m => m.Kind == StaticMarkerKind.MapLink).ToList().ForEach(link => {
            if (! link.metadata.TryGetValue("TargetMapId", out object? targetMapId)) return;
            if (targetMapId is not uint) return;

            if (!result.ContainsKey((uint) targetMapId)) {
                result[(uint) targetMapId] = FindAdjecentZoneIdChainFrom((uint) targetMapId, [mapId]);
            }
        });

        return result;
    }

    private List<uint> FindAdjecentZoneIdChainFrom(uint mapId, List<uint> chain)
    {
        var zone = Cache.GetZone(mapId);
        if (zone == null) return chain;

        zone.StaticMarkers.Where(m => m.Kind == StaticMarkerKind.MapLink).ToList().ForEach(link => {
            if (! link.metadata.TryGetValue("TargetMapId", out object? targetMapId)) return;
            if (targetMapId is not uint) return;

            if (chain.Contains((uint) targetMapId)) return;

            chain.Add((uint) targetMapId);
            chain = FindAdjecentZoneIdChainFrom((uint) targetMapId, chain);
        });

        return chain;
    }

    public unsafe void OnUpdate()
    {
        if (! gameStateManager.IsLoggedIn) {
            if (CurrentZone != null) {
                OnCurrentZoneChanged?.Invoke(null, CurrentZone);
                CurrentZone = null;
            }
            if (SelectedZone != null) {
                OnSelectedZoneChanged?.Invoke(null, SelectedZone);
                SelectedZone = null;
            }
            return;
        }

        var agentMap = AgentMap.Instance();
        if (agentMap == null) return;

        if (CurrentZone?.Id != agentMap->CurrentMapId) {
            var previousZone = CurrentZone;
            CurrentZone = Cache.GetZone(agentMap->CurrentMapId);
            OnCurrentZoneChanged?.Invoke(CurrentZone, previousZone);
        }

        if (SelectedZone?.Id != agentMap->SelectedMapId) {
            var previousZone = SelectedZone;
            SelectedZone = Cache.GetZone(agentMap->SelectedMapId);
            OnSelectedZoneChanged?.Invoke(SelectedZone, previousZone);
        }
    }

    private bool IsVanillaMapOpen => AgentMap.Instance()->AgentInterface.AddonId != 0;
}

internal delegate void ZoneChangedDelegate(Zone? zone, Zone? previousZone);
internal unsafe delegate void OpenMapByIdDelegate(AgentMap* agent, uint mapId);
internal unsafe delegate void OpenMapDelegate(AgentMap* agent, OpenMapInfo* data);
internal unsafe delegate void SetGatheringMarkerDelegate(AgentMap* agent, uint styleFlags, int mapX, int mapY, uint iconID, int radius, Utf8String* tooltip);
internal unsafe delegate void ShowMapDelegate(AgentInterface* agentMap, bool a1, bool a2);
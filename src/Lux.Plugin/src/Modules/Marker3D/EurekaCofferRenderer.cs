/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Numerics;
using System.Text.RegularExpressions;
using Dalamud.Game.ClientState.Conditions;
using Dalamud.Game.Text;
using Dalamud.Game.Text.SeStringHandling;
using Dalamud.Plugin;
using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Client.Game;
using FFXIVClientStructs.FFXIV.Client.UI.Agent;

namespace Lux;

[Service]
internal unsafe sealed class EurekaCofferRenderer : IDisposable
{
    private const uint LUCKY_CARROT_ID = 2002482;
    private readonly DalamudPluginInterface Plugin;
    private readonly IChatGui ChatGui;
    private readonly IClientState ClientState;
    private readonly ICondition Condition;
    private readonly WorldMarkerRenderer Renderer;
    private readonly ZoneManager ZoneManager;

    private Dictionary<string, WorldMarker> WorldMarkers = new();
    private uint LuckyCarrotLastUsedAt = 0;
    private WorldMarker? ClosestMarker = null;

    public EurekaCofferRenderer(DalamudPluginInterface plugin, IChatGui chatGui, IClientState cs, ICondition condition, WorldMarkerRenderer renderer, ZoneManager zm)
    {
        Plugin = plugin;
        ClientState = cs;
        Condition = condition;
        Renderer = renderer;
        ZoneManager = zm;
        ChatGui = chatGui;

        plugin.UiBuilder.Draw += OnDraw;
        chatGui.ChatMessageUnhandled += OnChatMessage;
    }

    public void Dispose()
    {
        Plugin.UiBuilder.Draw -= OnDraw;
        ChatGui.ChatMessageUnhandled -= OnChatMessage;
    }

    private void OnChatMessage(XivChatType type, uint senderId, SeString sender, SeString message)
    {
        var msg = message.TextValue.ToString().Trim();
        if (false == msg.StartsWith("You sense something ")) {
            return;
        }

        Logger.Info($"Eureka coffer message: {msg}");

        string pattern = @"You sense something\s*(?<dist>far(?:,\s*far)?)?(?:\s*immediately)?\s*to the (?<dir>\w+)\.";
        var result = Regex.Match(msg, pattern, RegexOptions.IgnoreCase);

        if (result.Success) {
            var dist = result.Groups["dist"].Value;
            var dir = result.Groups["dir"].Value;

            int minDistance = dist switch {
                "far" => 100,
                "far, far" => 200,
                _ => 0
            };
            int maxDistance = dist switch {
                "far" => 200,
                "far, far" => int.MaxValue,
                _ => 100
            };

            // Find all coffer positions towards the given direction which are at least {minDistance} away from the player.
            var playerPos = ClientState.LocalPlayer!.Position;
            var cofferPositions = EurekaCoffers.Positions[ZoneManager.CurrentZone!.TerritoryId];
            var coffers = cofferPositions
                .Where(c => {
                    float distance = Vector3.Distance(playerPos, c);
                    return distance >= minDistance && distance <= maxDistance;
                })
                .OrderBy(c => Vector3.Distance(playerPos, c));

            List<Vector3> res = [];

            // Filter out coffers that are not in the given direction.
            if (dir.Equals("south", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.Z > playerPos.Z && Math.Abs(c.X - playerPos.X) <= Math.Abs(c.Z - playerPos.Z)).ToList();
            } else if (dir.Equals("north", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.Z < playerPos.Z && Math.Abs(c.X - playerPos.X) <= Math.Abs(c.Z - playerPos.Z)).ToList();
            } else if (dir.Equals("east", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.X > playerPos.X && Math.Abs(c.X - playerPos.X) >= Math.Abs(c.Z - playerPos.Z)).ToList();
            } else if (dir.Equals("west", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.X < playerPos.X && Math.Abs(c.X - playerPos.X) >= Math.Abs(c.Z - playerPos.Z)).ToList();
            } else if (dir.Equals("southeast", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.Z >= playerPos.Z && c.X >= playerPos.X).ToList();
            } else if (dir.Equals("southwest", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.Z >= playerPos.Z && c.X <= playerPos.X).ToList();
            } else if (dir.Equals("northeast", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.Z <= playerPos.Z && c.X >= playerPos.X).ToList();
            } else if (dir.Equals("northwest", StringComparison.OrdinalIgnoreCase)) {
                res = coffers.Where(c => c.Z <= playerPos.Z && c.X <= playerPos.X).ToList();
            }

            RemoveAll();

            foreach (var m in res) {
                var hash = $"{m.X}:{m.Y}:{m.Z}";

                if (false == WorldMarkers.ContainsKey(hash)) {
                    var wm = new WorldMarker(hash, "", 60356, new Vector2(), m, true, 1000f)
                    {
                        MinAlpha = 0.5f
                    };

                    Renderer.AddMarker(wm);
                    WorldMarkers[hash] = wm;
                }
            }

            Logger.Info($"Found {res.Count} coffers in the given direction.");
        }
    }

    private unsafe void OnDraw()
    {
        if (null == ClientState.LocalPlayer) return;
        if (null == ZoneManager.CurrentZone) return;

        if (false == EurekaCoffers.Positions.ContainsKey(ZoneManager.CurrentZone!.TerritoryId)) {
            RemoveAll();
            return;
        }

        if (false == HasLuckyCarrot() && WorldMarkers.Count > 0) {
            RemoveAll();
            return;
        }

        if (WorldMarkers.Count > 0) {
            ClosestMarker = WorldMarkers.Values.OrderBy(m => m.Distance).First();
        }

        if (!Condition[ConditionFlag.InCombat] && Condition[ConditionFlag.Mounted] && HasLuckyCarrot()) {
            UseLuckyCarrot();
        }
    }

    private void RemoveAll()
    {
        foreach (var marker in WorldMarkers.Values) {
            Renderer.RemoveMarker(marker);
        }

        WorldMarkers.Clear();
        ClosestMarker = null;
    }

    private void UseLuckyCarrot()
    {
        long now = DateTimeOffset.Now.ToUnixTimeSeconds();
        float dst = ClosestMarker == null ? float.MaxValue : ClosestMarker.Distance;

        // If the lucky carrot was used less than 10 seconds ago, don't use it again.
        var last = now - LuckyCarrotLastUsedAt;
        if (last > 10 || (last > 3 && dst < 10)) {
            LuckyCarrotLastUsedAt = (uint) now;

            AgentInventoryContext* aic = AgentInventoryContext.Instance();
            if (aic == null) return;

            aic->UseItem(LUCKY_CARROT_ID);
        }
    }

    private bool HasLuckyCarrot()
    {
        InventoryManager* im = InventoryManager.Instance();
        if (im == null) return false;

        return im->GetInventoryItemCount(LUCKY_CARROT_ID) > 0;
    }
}

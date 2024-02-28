/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Game.ClientState.Objects.Enums;
using Dalamud.Game.ClientState.Objects.SubKinds;
using Dalamud.Game.ClientState.Objects.Types;
using Dalamud.Plugin.Services;
using Lumina.Excel.GeneratedSheets;
using Lux.Models;

namespace Lux;

[Service] internal sealed class ActorManager(GameStateManager gsm, ZoneManager zm, IObjectTable objectTable) : IUpdatable, IDisposable
{
    private readonly GameStateManager gameStateManager = gsm;
    private readonly ZoneManager zoneManager           = zm;
    private readonly IObjectTable objectTable          = objectTable;

    private readonly Dictionary<uint, PlayerOnlineStatus> OnlineStatusCache = [];
    private readonly Dictionary<string, PlayerActor> Players                = [];
    private readonly Dictionary<string, NpcActor> NPCs                      = [];
    private readonly Dictionary<string, GatheringNodeActor> GatheringNodes  = [];

    public PlayerActor? FindPlayerByName(string name)
    {
        if (name.Equals("you", StringComparison.OrdinalIgnoreCase)) return Players.Values.FirstOrDefault(p => p.Id == gameStateManager.Character?.ObjectId.ToString("X"));

        // Find player by name case insensitive.
        return Players.Values.FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
    }

    public PlayerActor? GetPrimaryPlayer()
    {
        return Players.Values.FirstOrDefault(p => p.Id == gameStateManager.Character?.ObjectId.ToString("X"));
    }

    public List<PlayerActor> PlayerActors => [.. Players.Values];
    public List<NpcActor> NpcActors       => [.. NPCs.Values];
    public List<GatheringNodeActor> GatheringNodeActors => [.. GatheringNodes.Values];

    public void OnUpdate()
    {
        if (! gameStateManager.IsLoggedIn) {
            Players.Clear();
            NpcActors.Clear();
            return;
        }

        List<string> ActiveObjectIds = [];

        foreach (var gameObject in objectTable.ToList()) {
            if (gameObject == null || !gameObject.IsValid()) continue;

            ActiveObjectIds.Add(gameObject.ObjectId.ToString("X"));

            if (gameObject is { ObjectKind: ObjectKind.Player}) {
                if (! Players.TryGetValue(gameObject.ObjectId.ToString("X"), out var player)) {
                    player = new PlayerActor { Id = gameObject.ObjectId.ToString("X") };
                    Players.Add(gameObject.ObjectId.ToString("X"), player);
                }

                UpdatePlayer(player, (PlayerCharacter)gameObject);
            } else if (gameObject is { ObjectKind: ObjectKind.BattleNpc}) {
                if (! NPCs.TryGetValue(gameObject.ObjectId.ToString("X"), out var npc)) {
                    npc = new NpcActor { Id = gameObject.ObjectId.ToString("X") };
                    NPCs.Add(gameObject.ObjectId.ToString("X"), npc);
                }

                UpdateNpc(npc, (BattleNpc)gameObject);
            } else if (gameObject is { ObjectKind: ObjectKind.GatheringPoint}) {
                if (! GatheringNodes.TryGetValue(gameObject.ObjectId.ToString("X"), out var node)) {
                    node = new GatheringNodeActor { Id = gameObject.ObjectId.ToString("X") };
                    GatheringNodes.Add(gameObject.ObjectId.ToString("X"), node);
                }

                UpdateGatheringNode(node, gameObject);
            }
        }

        foreach (var id in Players.Keys.ToList()) {
            if (! ActiveObjectIds.Contains(id)) {
                Players.Remove(id);
            }
        }

        foreach (var id in NPCs.Keys.ToList()) {
            if (! ActiveObjectIds.Contains(id)) {
                NPCs.Remove(id);
            }
        }

        foreach (var id in GatheringNodes.Keys.ToList()) {
            if (! ActiveObjectIds.Contains(id)) {
                GatheringNodes.Remove(id);
            }
        }
    }

    public void Dispose()
    {
    }

    private void UpdatePlayer(PlayerActor actor, PlayerCharacter player)
    {
        if (null == zoneManager.CurrentZone) return;

        var pos  = Vec2.FromWorldPosition(player.Position, zoneManager.CurrentZone);
        var wPos = Vec3.FromVector3(player.Position);

        if (actor.Position != pos) {
            actor.Position = pos;
            actor.IsMoving = true;
        } else {
            actor.IsMoving = false;
        }

        if (! OnlineStatusCache.TryGetValue(player.OnlineStatus.Id, out var status)) {
            OnlineStatusCache.Add(player.OnlineStatus.Id, new PlayerOnlineStatus {
                Id     = player.OnlineStatus.Id,
                Name   = player.OnlineStatus.GameData?.Name.ToString() ?? "",
                IconId = player.OnlineStatus.GameData?.Icon ?? 0,
            });
        }

        var onlineStatus     = OnlineStatusCache[player.OnlineStatus.Id];
        var isInCombat       = player.StatusFlags.HasFlag(StatusFlags.InCombat);
        var isHostile        = player.StatusFlags.HasFlag(StatusFlags.Hostile);
        var isPartyMember    = player.StatusFlags.HasFlag(StatusFlags.PartyMember);
        var isAllianceMember = player.StatusFlags.HasFlag(StatusFlags.AllianceMember);

        if (actor.WorldPosition != wPos) actor.WorldPosition                      = wPos;
        if (actor.Heading != player.Rotation) actor.Heading                       = -player.Rotation + MathF.PI;
        if (actor.Name != player.Name.ToString()) actor.Name                      = player.Name.ToString();
        if (actor.JobId != player.ClassJob.Id) actor.JobId                        = player.ClassJob.Id;
        if (actor.CurrentHp != player.CurrentHp) actor.CurrentHp                  = player.CurrentHp;
        if (actor.MaxHp != player.MaxHp) actor.MaxHp                              = player.MaxHp;
        if (actor.CurrentMp != player.CurrentMp) actor.CurrentMp                  = player.CurrentMp;
        if (actor.MaxMp != player.MaxMp) actor.MaxMp                              = player.MaxMp;
        if (actor.TargetId != player.TargetObjectId.ToString("X")) actor.TargetId = player.TargetObjectId.ToString("X");
        if (actor.IsInCombat != isInCombat) actor.IsInCombat                      = isInCombat;
        if (actor.IsHostile != isHostile) actor.IsHostile                         = isHostile;
        if (actor.IsPartyMember != isPartyMember) actor.IsPartyMember             = isPartyMember;
        if (actor.IsAllianceMember != isAllianceMember) actor.IsAllianceMember    = isAllianceMember;
        if (actor.OnlineStatus != onlineStatus) actor.OnlineStatus                = onlineStatus;

        actor.CastAction = null;
        if (player.IsCasting) {
            var info = ExcelSheet<Lumina.Excel.GeneratedSheets.Action>.Find(player.CastActionId);
            if (null != info) {
                actor.CastAction = new Models.Action {
                    Id              = info.RowId,
                    IconId          = info.Icon,
                    Name            = info.Name.ToString(),
                    CurrentCastTime = player.CurrentCastTime,
                    TotalCastTime   = player.TotalCastTime,
                    IsInterruptible = player.IsCastInterruptible,
                };
            }
        }
    }

    private void UpdateNpc(NpcActor actor, BattleNpc npc)
    {
        if (null == zoneManager.CurrentZone) return;

        var pos = Vec2.FromWorldPosition(npc.Position, zoneManager.CurrentZone);

        if (actor.Position != pos) {
            actor.Position = pos;
            actor.IsMoving = true;
        } else {
            actor.IsMoving = false;
        }

        var worldPos   = Vec3.FromVector3(npc.Position);
        var isInCombat = npc.StatusFlags.HasFlag(StatusFlags.InCombat);
        var isHostile  = npc.StatusFlags.HasFlag(StatusFlags.Hostile);
        var npcData    = ExcelSheet<BNpcBase>.Find(npc.DataId);
        var npcKind    = npcData?.Unknown12;
        var rank       = GetNpcRank(npc.DataId) ?? 0;

        if (npc.ClassJob.Id > 0 || (npcData?.Battalion == 0 && npcData?.Unknown12 == 0 && !isHostile)) {
            npcKind = 4; // Friendly.
        }

        if (actor.Kind != npcKind) actor.Kind                                  = npcKind;
        if (actor.SubKind != npc.SubKind) actor.SubKind                        = npc.SubKind;
        if (actor.NpcKind != npc.BattleNpcKind) actor.NpcKind                  = npc.BattleNpcKind;
        if (actor.WorldPosition != worldPos) actor.WorldPosition               = worldPos;
        if (actor.Heading != npc.Rotation) actor.Heading                       = -npc.Rotation + MathF.PI;
        if (actor.Name != npc.Name.ToString()) actor.Name                      = npc.Name.ToString();
        if (actor.TargetId != npc.TargetObjectId.ToString("X")) actor.TargetId = npc.TargetObjectId.ToString("X");
        if (actor.CurrentHp != npc.CurrentHp) actor.CurrentHp                  = npc.CurrentHp;
        if (actor.MaxHp != npc.MaxHp) actor.MaxHp                              = npc.MaxHp;
        if (actor.IsTargetable != npc.IsTargetable) actor.IsTargetable         = npc.IsTargetable;
        if (actor.IsInCombat != isInCombat) actor.IsInCombat                   = isInCombat;
        if (actor.IsHostile != isHostile) actor.IsHostile                      = isHostile;
        if (actor.IsDead != npc.IsDead) actor.IsDead                           = npc.IsDead;
        if (actor.Rank != rank) actor.Rank                                     = rank;

        actor.Special = npc.StatusFlags;

        actor.CastAction = null;
        if (npc.IsCasting) {
            var info = ExcelSheet<Lumina.Excel.GeneratedSheets.Action>.Find(npc.CastActionId);
            if (null != info) {
                actor.CastAction = new Models.Action {
                    Id              = info.RowId,
                    IconId          = info.Icon,
                    Name            = info.Name.ToString(),
                    CurrentCastTime = npc.CurrentCastTime,
                    TotalCastTime   = npc.TotalCastTime,
                    IsInterruptible = npc.IsCastInterruptible,
                };
            }
        }
    }

    private void UpdateGatheringNode(GatheringNodeActor actor, GameObject gameObject)
    {
        if (null == zoneManager.CurrentZone) return;

        actor.Name = gameObject.Name.ToString();
        actor.Position = Vec2.FromWorldPosition(gameObject.Position, zoneManager.CurrentZone);
        actor.WorldPosition = Vec3.FromVector3(gameObject.Position);
        actor.IsTargetable = gameObject.IsTargetable;

        var info = ExcelSheet<GatheringPoint>.Find(gameObject.DataId);
        if (null == info) return;

        actor.TypeName = info.GatheringPointBase.Value?.GatheringType.Value?.Name.ToString() ?? "";
        actor.IconId = info.GatheringPointBase.Value?.GatheringType.Value?.IconMain ?? 0;
        actor.AltIconId = info.GatheringPointBase.Value?.GatheringType.Value?.IconOff ?? 0;
    }

    private readonly Dictionary<uint, byte?> NpcRankCache = [];

    private uint? GetNpcRank(uint bNpcId)
    {
        if (NpcRankCache.TryGetValue(bNpcId, out var rank)) return rank;

        var nm = ExcelSheet<NotoriousMonster>.All.Where(n => n.BNpcBase.Row == bNpcId).FirstOrDefault();
        NpcRankCache.Add(bNpcId, nm?.Rank);

        return nm?.Rank;
    }
}

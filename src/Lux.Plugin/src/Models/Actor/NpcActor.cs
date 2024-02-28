/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     /
* Package: Lux.Plugin                              |    |___|    |  / /     \
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Dalamud.Game.ClientState.Objects.Enums;
using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record NpcActor
{
    [Offset(0)]  public string Id          = string.Empty;
    [Offset(1)]  public uint? Kind         = null;
    [Offset(2)] public BattleNpcSubKind NpcKind = BattleNpcSubKind.None;
    [Offset(3)] public uint? SubKind       = null;
    [Offset(4)]  public string Name        = string.Empty;
    [Offset(5)]  public bool IsMoving      = false;
    [Offset(6)]  public Vec2 Position      = new();
    [Offset(7)]  public Vec3 WorldPosition = new();
    [Offset(8)]  public float Heading      = 0.0f;
    [Offset(9)]  public string? TargetId   = null;
    [Offset(10)]  public string? OwnerId    = null;
    [Offset(11)]  public uint CurrentHp     = 0;
    [Offset(12)]  public uint MaxHp         = 0;
    [Offset(13)] public bool IsTargetable   = false;
    [Offset(14)]  public bool IsInCombat    = false;
    [Offset(15)] public bool IsHostile     = false;
    [Offset(16)] public bool IsDead        = false;
    [Offset(17)] public Action? CastAction = null;
    [Offset(18)]  public uint Rank         = 0;
    [Offset(19)] public object? Special = null;
}

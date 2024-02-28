      /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record PlayerActor
{
    [Offset(0)]  public string Id                       = string.Empty;
    [Offset(1)]  public string Name                     = string.Empty;
    [Offset(2)]  public bool IsMoving                   = false;
    [Offset(3)]  public Vec2 Position                   = new();
    [Offset(4)]  public Vec3 WorldPosition              = new();
    [Offset(5)]  public float Heading                   = 0.0f;
    [Offset(6)]  public string? TargetId                = string.Empty;
    [Offset(7)]  public uint JobId                      = 0;
    [Offset(8)]  public uint CurrentHp                  = 0;
    [Offset(9)]  public uint MaxHp                      = 0;
    [Offset(10)]  public uint CurrentMp                  = 0;
    [Offset(11)]  public uint MaxMp                      = 0;
    [Offset(12)] public bool IsInCombat                 = false;
    [Offset(13)] public bool IsHostile                  = false;
    [Offset(14)] public bool IsPartyMember              = false;
    [Offset(15)] public bool IsAllianceMember           = false;
    [Offset(16)] public bool IsDead                     = false;
    [Offset(17)] public PlayerOnlineStatus OnlineStatus = new();
    [Offset(18)] public Action? CastAction              = null;
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record FateMarker
{
    [Offset(0)] public FateStateKind State;
    [Offset(1)] public uint IconId;
    [Offset(2)] public string Name = string.Empty;
    [Offset(3)] public string Description = string.Empty;
    [Offset(4)] public string Objective = string.Empty;
    [Offset(5)] public int StartTimeEpoch;
    [Offset(6)] public float Duration;
    [Offset(7)] public float Progress;
    [Offset(8)] public float Radius;
    [Offset(9)] public byte Level;
    [Offset(10)] public byte MaxLevel;
    [Offset(11)] public Vec2 Position = new();
    [Offset(12)] public bool IsExpBonus;
    [Offset(13)] public byte HandInCount;
}

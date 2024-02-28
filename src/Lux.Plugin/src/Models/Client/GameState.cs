        /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record GameState
{
    [Offset(0)] public bool IsLoggedIn;
    [Offset(1)] public string? PlayerId;
    [Offset(2)] public uint? ZoneId;
    [Offset(3)] public bool IsOccupied;
    [Offset(4)] public bool IsInCutscene;
    [Offset(5)] public bool IsBetweenAreas;
    [Offset(6)] public bool IsMounted;
    [Offset(7)] public bool IsFlying;
    [Offset(8)] public bool IsInDuty;
    [Offset(9)] public bool IsInCombat;
    [Offset(10)] public bool IsInParty;
}

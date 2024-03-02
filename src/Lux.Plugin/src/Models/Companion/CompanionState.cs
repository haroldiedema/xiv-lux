/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record CompanionState
{
    [Offset(0)] public string Name = string.Empty;
    [Offset(1)] public uint Level;
    [Offset(2)] public uint CurrentXP;
    [Offset(3)] public uint MaxXP;
    [Offset(4)] public float TimeLeft;
    [Offset(5)] public bool CanSummon;
    [Offset(6)] public uint IconId;
    [Offset(7)] public CompanionCommand Command;
}

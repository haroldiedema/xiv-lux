          /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record Action
{
    [Offset(0)] public uint Id;
    [Offset(1)] public uint IconId           = 0;
    [Offset(2)] public string Name           = string.Empty;
    [Offset(3)] public float CurrentCastTime = 0;
    [Offset(4)] public float TotalCastTime   = 0;
    [Offset(5)] public bool IsInterruptible  = false;
}

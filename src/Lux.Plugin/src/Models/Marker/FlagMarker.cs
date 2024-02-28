    /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record FlagMarker
{
    [Offset(0)] public uint IconId;
    [Offset(1)] public uint MapId;
    [Offset(2)] public uint TerritoryId;
    [Offset(3)] public Vec2 Position = new();
}

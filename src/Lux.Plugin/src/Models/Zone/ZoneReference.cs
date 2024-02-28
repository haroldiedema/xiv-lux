    /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record ZoneReference
{
    [Offset(0)] public uint Id;
    [Offset(1)] public string PlaceName    = string.Empty;
    [Offset(2)] public string PlaceNameSub = string.Empty;
    [Offset(3)] public string RegionName   = string.Empty;
}

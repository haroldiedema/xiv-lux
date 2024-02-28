    /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

public enum StaticMarkerKind : byte
{
    Standard     = 0,
    MapLink      = 1,
    InstanceLink = 2,
    Aetheryte    = 3,
    Aethernet    = 4,
}

[Model]
public record StaticMarker
{
    [Offset(0)] public StaticMarkerKind Kind;
    [Offset(1)] public uint IconId;
    [Offset(2)] public string Name       = string.Empty;
    [Offset(3)] public Vec2 Position     = new();
    [Offset(4)] public Dictionary<string, object?> metadata = [];
}

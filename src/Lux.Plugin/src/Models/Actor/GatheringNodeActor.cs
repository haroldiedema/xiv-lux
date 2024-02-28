        /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record GatheringNodeActor
{
    [Offset(0)] public string Id = string.Empty;
    [Offset(1)] public string Name = string.Empty;
    [Offset(2)] public Vec2 Position = new();
    [Offset(3)] public Vec3 WorldPosition = new();
    [Offset(4)] public bool IsTargetable = false;
    [Offset(5)] public uint RequiredJobId = 0;
    [Offset(6)] public string TypeName = string.Empty;
    [Offset(7)] public int IconId = 0;
    [Offset(8)] public int AltIconId = 0;
}

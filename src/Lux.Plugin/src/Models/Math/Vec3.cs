    /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record Vec3
{
    [Offset(0)] public float X;
    [Offset(1)] public float Y;
    [Offset(2)] public float Z;

    public static Vec3 FromVector3(System.Numerics.Vector3 v) => new() { X = v.X, Y = v.Y, Z = v.Z };
}

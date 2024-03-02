/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     /
* Package: Lux.Plugin                              |    |___|    |  / /     \
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Lumina.Excel.GeneratedSheets;
using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record Vec2
{
    [Offset(0)] public float X;
    [Offset(1)] public float Y;

    public static Vec2 FromVector2(System.Numerics.Vector2 v) => new() { X = v.X, Y = v.Y };

    public static Vec2 FromVector3(System.Numerics.Vector3 v) => new() { X = v.X, Y = v.Z };

    public static Vec2 FromWorldPosition(System.Numerics.Vector3 v, Zone zone)
    {
        var vec = FromVector3(v);
        
        vec.X = (vec.X * zone.SizeFactor / 100.0f) + (zone.Offset.X * (zone.SizeFactor / 100.0f)) + 1024.0f;
        vec.Y = (vec.Y * zone.SizeFactor / 100.0f) + (zone.Offset.Y * (zone.SizeFactor / 100.0f)) + 1024.0f;

        return vec;
    }

    public static Vec2 FromWorldPosition(System.Numerics.Vector3 v, Map map)
    {
        var vec = FromVector3(v);
        
        vec.X = (vec.X * map.SizeFactor / 100.0f) + (map.OffsetX * (map.SizeFactor / 100.0f)) + 1024.0f;
        vec.Y = (vec.Y * map.SizeFactor / 100.0f) + (map.OffsetY * (map.SizeFactor / 100.0f)) + 1024.0f;

        return vec;
    }
}

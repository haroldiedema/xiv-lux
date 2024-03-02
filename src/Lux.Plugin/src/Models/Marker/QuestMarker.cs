/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record QuestMarker
{
    [Offset(0)] public QuestMarkerKind Kind;
    [Offset(1)] public uint QuestId;
    [Offset(2)] public uint IconId;
    [Offset(3)] public uint MapId;
    [Offset(4)] public uint? TargetMapId;
    [Offset(5)] public float Radius = 0;
    [Offset(6)] public Vec2 Position = new();
    [Offset(7)] public Vec3 WorldPosition = new();
    [Offset(8)] public Quest? Quest;
}

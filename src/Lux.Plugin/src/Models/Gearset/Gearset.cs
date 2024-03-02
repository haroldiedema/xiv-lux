/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public class Gearset
{
    [Offset(0)] public int Id; 
    [Offset(1)] public string Name = string.Empty;
    [Offset(2)] public string JobCategory = string.Empty;
    [Offset(3)] public byte Role;
    [Offset(4)] public int ItemLevel;
    [Offset(5)] public int ClassJobId;
    [Offset(6)] public int JobIconId;
    [Offset(7)] public List<Item> Items = [];
    [Offset(8)] public Item MainHand = null!;
}
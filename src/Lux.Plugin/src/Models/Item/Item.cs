/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     /
* Package: Lux.Plugin                              |    |___|    |  / /     \
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record Item
{
    [Offset(0)] public uint Id;
    [Offset(1)] public ushort IconId;
    [Offset(2)] public string Name = string.Empty;
    [Offset(3)] public string CategoryName = string.Empty;
    [Offset(4)] public int CategoryIconId;
    [Offset(5)] public string JobCategory = string.Empty;
    [Offset(6)] public uint RequiredJobId;
    [Offset(7)] public uint RequiredLevel;
    [Offset(8)] public uint ItemLevel;
    [Offset(9)] public bool IsDyeable;
    [Offset(10)] public bool IsCollectible;
    [Offset(11)] public bool IsUntradable;

    public static Item FromItemRow(Lumina.Excel.GeneratedSheets.Item item)
    {
        return new()
        {
            Id = item.RowId,
            IconId = item.Icon,
            Name = item.Name,
            CategoryName = item.ItemUICategory.Value?.Name.ToString() ?? "Unclassified",
            CategoryIconId = item.ItemUICategory.Value?.Icon ?? 0,
            JobCategory = item.ClassJobCategory.Value?.Name.ToString() ?? "Unrestricted",
            RequiredJobId = item.ClassJobCategory.Value?.RowId ?? 0,
            RequiredLevel = item.LevelEquip,
            ItemLevel = item.LevelItem.Value?.RowId ?? 0,
            IsDyeable = item.IsDyeable,
            IsCollectible = item.IsCollectable,
            IsUntradable = item.IsUntradable,
        };
    }
}

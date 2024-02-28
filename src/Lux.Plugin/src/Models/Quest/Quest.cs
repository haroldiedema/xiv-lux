    /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record Quest
{
    [Offset(0)] public uint Id;
    [Offset(1)] public string Name = string.Empty;
    [Offset(2)] public string RequiredJobCategory = string.Empty;
    [Offset(3)] public ushort RequiredJobLevel;
    [Offset(4)] public uint? RequiredJobId;
    [Offset(5)] public uint? BannerImage;
    [Offset(6)] public bool IsHouseRequired;
    [Offset(7)] public bool IsRepeatable;
    [Offset(8)] public QuestRewards Rewards = new();

    public static Quest? FromQuestRow(Lumina.Excel.GeneratedSheets.Quest? quest)
    {
        if (quest == null) return null;

        return new()
        {
            Id = quest.RowId,
            Name = quest.Name,
            RequiredJobCategory = quest.ClassJobCategory0.Value?.Name.ToString() ?? "Unrestricted",
            RequiredJobLevel = quest.ClassJobLevel0,
            RequiredJobId = quest.ClassJobRequired.Value?.RowId,
            BannerImage = quest.Icon,
            IsHouseRequired = quest.IsHouseRequired,
            IsRepeatable = quest.IsRepeatable,
            Rewards = QuestRewards.FromQuestRow(quest),
        };
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record QuestRewards
{
    [Offset(0)] public uint Gil = 0;
    [Offset(1)] public List<Item> Items = [];
    [Offset(2)] public List<Item> OptionalItems = [];
    [Offset(3)] public Emote? Emote;
    [Offset(4)] public SkillAction? Action;
    [Offset(5)] public List<SkillAction> GeneralActions = [];

    public static QuestRewards FromQuestRow(Lumina.Excel.GeneratedSheets.Quest quest)
    {
        return new QuestRewards {
            Gil = quest.GilReward,
            Items = quest.ItemReward
                .Select(ExcelSheet<Lumina.Excel.GeneratedSheets.Item>.Find)
                .Where(item => item != null && item.RowId > 0)
                .Select(Item.FromItemRow!).ToList(),
            OptionalItems = quest.OptionalItemReward
                .Select(row => row.Value)
                .Where(item => item != null && item.RowId > 0)
                .Select(Item.FromItemRow!).ToList(),
            Emote = quest.EmoteReward.Value?.RowId > 0 ? Emote.FromEmoteRow(quest.EmoteReward.Value!) : null,
            Action = quest.ActionReward.Value?.RowId > 0 ? SkillAction.FromActionRow(quest.ActionReward.Value!) : null,
            GeneralActions = quest.GeneralActionReward
                .Select(ga => ga.Value?.Action.Value)
                .Where(action => action != null && action.RowId > 0)
                .Select(SkillAction.FromActionRow!).ToList(),
        };
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using FFXIVClientStructs.FFXIV.Application.Network.WorkDefinitions;
using Lumina.Excel.GeneratedSheets;

namespace Lux;

[Service]
public unsafe class QuestRepository
{
    public List<Quest> GetActiveQuests()
    {
        var result = new List<Quest>();
        foreach (var questWork in GetAcceptedQuests())
        {
            var quest = FindById(questWork.QuestId);
            if (quest == null) continue;

            result.Add(quest);
        }

        return result;
    }

    public Quest? FindActiveByName(string name)
    {
        foreach (var questWork in GetAcceptedQuests())
        {
            var quest = FindById(questWork.QuestId);
            if (quest == null) continue;

            if (string.Equals(quest.Name.ToString(), name, System.StringComparison.InvariantCultureIgnoreCase))
            {
                return quest;
            }
        }

        return null;
    }

    public Quest? FindByName(string name)
    {
        foreach (var quest in ExcelSheet<Quest>.All)
        {
            if (quest.RowId == 0 || quest.Name.ToString() == "") continue;

            if (string.Equals(quest.Name.ToString(), name, System.StringComparison.InvariantCultureIgnoreCase))
            {
                return quest;
            }
        }

        return null;
    }

    public Quest? FindById(uint id)
    {
        return ExcelSheet<Quest>.Find(id + 65536u);
    }

    public QuestWork? FindWorkByQuestId(uint id)
    {
        var qm = FFXIVClientStructs.FFXIV.Client.Game.QuestManager.Instance();
        if (qm == null) return null;

        foreach (var questWork in qm->NormalQuestsSpan)
        {
            if (questWork.QuestId == id)
            {
                return questWork;
            }
        }

        return null;
    }

    public List<QuestWork> GetAcceptedQuests()
    {
        var qm = FFXIVClientStructs.FFXIV.Client.Game.QuestManager.Instance();
        if (qm == null) return [];

        var result = new List<QuestWork>();
        foreach (var questWork in qm->NormalQuestsSpan)
        {
            if (questWork is not { IsHidden: false, QuestId: > 0 }) continue;

            result.Add(questWork);
        }

        return result;
    }
}

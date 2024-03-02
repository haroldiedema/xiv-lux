/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Hooking;
using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Client.Game;
using FFXIVClientStructs.FFXIV.Client.Game.UI;
using FFXIVClientStructs.FFXIV.Client.UI.Agent;
using Lumina.Excel.GeneratedSheets;
using Lux.Models;

namespace Lux;

[Service]
internal unsafe sealed class CompanionManager : IDisposable
{
    private const uint GYSAHL_GREENS_ID = 4868;

    public CompanionManager()
    {
        var actions = ExcelSheet<Lumina.Excel.GeneratedSheets.BuddyAction>.All.ToList();
        foreach (var action in actions) {
            Logger.Info($"Action: {action.Name} ({action.RowId})");
        }
    }

    public void Dispose()
    {
    }

    public CompanionState? GetCompanionState()
    {
        UIState* ui = UIState.Instance();
        if (ui == null) return null;

        var buddy = ui->Buddy.CompanionInfo;
        if (buddy.Rank == 0) return null;

        var rank = ExcelSheet<BuddyRank>.Find(buddy.Rank);
        if (rank == null) return null;

        InventoryManager* im = InventoryManager.Instance();
        if (im == null) return null;

        return new CompanionState
        {
            Name = buddy.Name,
            Level = buddy.Rank,
            CurrentXP = buddy.CurrentXP,
            MaxXP = rank.ExpRequired,
            TimeLeft = buddy.TimeLeft,
            CanSummon = im->GetInventoryItemCount(GYSAHL_GREENS_ID) > 0,
            IconId = GetIconId(buddy),
            Command = (CompanionCommand) buddy.ActiveCommand,
        };
    }

    public void UseBuddyAction(byte actionId)
    {
        UIState* ui = UIState.Instance();
        if (ui == null) return;

        ActionManager* am = ActionManager.Instance();
        if (am == null) return;

        am->UseAction(ActionType.BuddyAction, actionId);
    }

    public void Summon()
    {
        if (! CanSummonCompanion()) return;

        AgentInventoryContext* aic = AgentInventoryContext.Instance();
        if (aic == null) return;

        aic->UseItem(GYSAHL_GREENS_ID);
    }

    public bool CanSummonCompanion()
    {
        InventoryManager* im = InventoryManager.Instance();
        if (im == null) return false;

        return im->GetInventoryItemCount(GYSAHL_GREENS_ID) > 0;
    }

    private uint GetIconId(CompanionInfo info)
    {
        if (info.TimeLeft < 1) {
            return 25218; // Gysahl Greens.
        }

        return info.ActiveCommand switch
        {
            3 => 902, // Follow
            4 => 906, // Free Stance
            5 => 903, // Defender Stance
            6 => 904, // Attacker Stance
            7 => 905, // Healer Stance
            _ => 25218,
        };
    }
}

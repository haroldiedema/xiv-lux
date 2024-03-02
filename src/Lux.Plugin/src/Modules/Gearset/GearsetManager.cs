/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Runtime.InteropServices;
using FFXIVClientStructs.FFXIV.Client.UI.Misc;
using Lux.Models;

namespace Lux;

[Service]
internal unsafe sealed class GearsetManager(GameStateManager gsm)
{
    public int GetCurrentGearset()
    {
        if (! gsm.IsLoggedIn) return -1;

        RaptureGearsetModule* rgm = RaptureGearsetModule.Instance();
        if (rgm == null) return -1;

        return rgm->CurrentGearsetIndex;
    }

    public void SetCurrentGearset(int index)
    {
        if (! gsm.IsLoggedIn) return;

        RaptureGearsetModule* rgm = RaptureGearsetModule.Instance();
        if (rgm == null) return;

        rgm->EquipGearset(index);
    }

    public List<Gearset> GetGearsets()
    {
        if (! gsm.IsLoggedIn) return [];

        RaptureGearsetModule* rgm = RaptureGearsetModule.Instance();
        if (rgm == null) return [];

        List<Gearset> result = [];
        foreach (var gs in rgm->EntriesSpan) {
            if (gs.ItemLevel == 0) continue;

            var cj = ExcelSheet<Lumina.Excel.GeneratedSheets.ClassJob>.Find(gs.ClassJob);
            if (cj == null) continue;

            var mh = ExcelSheet<Lumina.Excel.GeneratedSheets.Item>.Find(gs.MainHand.ItemID)
                ?? ExcelSheet<Lumina.Excel.GeneratedSheets.Item>.Find(gs.MainHand.ItemID - 1_000_000)
                ?? ExcelSheet<Lumina.Excel.GeneratedSheets.Item>.Find(gs.OffHand.ItemID)
                ?? ExcelSheet<Lumina.Excel.GeneratedSheets.Item>.Find(gs.OffHand.ItemID - 1_000_000);
            if (mh == null) {
                continue;
            }

            result.Add(new Gearset {
                Id = gs.ID,
                Name = Marshal.PtrToStringAnsi((IntPtr)gs.Name) ?? "N/A",
                JobCategory = cj.ClassJobCategory.Value?.Name ?? "N/A",
                Role = cj.Role,
                ItemLevel = gs.ItemLevel,
                ClassJobId = gs.ClassJob,
                JobIconId = rgm->GetClassJobIconForGearset(gs.ID),
                MainHand = Item.FromItemRow(mh),
                Items = gs.ItemsSpan.ToArray()
                    .Select(i => ExcelSheet<Lumina.Excel.GeneratedSheets.Item>.Find(i.ItemID))
                    .Where(i => i != null)
                    .Select(i => Item.FromItemRow(i!))
                    .ToList()
            });
        }

        return result;
    }
}

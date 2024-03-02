
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using FFXIVClientStructs.FFXIV.Client.UI;
using FFXIVClientStructs.FFXIV.Component.GUI;
using Lux.Server.Configuration;

namespace Lux;

[Controller]
internal unsafe sealed class UIVisibilityController
{
    private static List<string> _ignoredAddonNames = [
        "_FocusTargetInfo", "JobHudNotice", "JobHud", "JobGauge", "Talk", "Bait", "IKDFishingLog",
        "EurekaElementalHud", "EurekaMagiciteItemAtherList", "SelectYesNo", "SelectString", "AreaMap"
    ];

    [WebSocketEventStream("VisibleNativeElements", 4)]
    public string[] StreamVisibleNativeElements()
    {
        AtkStage* stage = AtkStage.GetSingleton();
        if (stage == null) { return []; }

        RaptureAtkUnitManager* manager = stage->RaptureAtkUnitManager;
        if (manager == null) { return []; }

        AtkUnitList* loadedUnitsList = &manager->AtkUnitManager.AllLoadedUnitsList;
        if (loadedUnitsList == null) { return []; }

        List<string> visibleNames = [];

        for (int i = 0; i < loadedUnitsList->Count; i++)
        {
            try
            {
                AtkUnitBase* addon = *(AtkUnitBase**)Unsafe.AsPointer(ref loadedUnitsList->EntriesSpan[i]);

                if (addon == null || !addon->IsVisible || addon->WindowNode == null || addon->Scale == 0)
                {
                    continue;
                }

                string? name = Marshal.PtrToStringAnsi(new IntPtr(addon->Name));
                if (name == null) continue;
                if (name.EndsWith("Detail")) continue; // Tooltips.
                if (name.EndsWith("Notice")) continue;
                if (_ignoredAddonNames.Contains(name)) continue;

                visibleNames.Add(name);
            } catch {}
        }

        return [.. visibleNames];
    }
}
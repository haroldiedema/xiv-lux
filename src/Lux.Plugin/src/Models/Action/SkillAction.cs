/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     /
* Package: Lux.Plugin                              |    |___|    |  / /     \
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record SkillAction
{
    [Offset(0)] public uint Id;
    [Offset(1)] public ushort IconId;
    [Offset(2)] public string Name = string.Empty;
    [Offset(3)] public string Category = string.Empty;
    [Offset(4)] public uint JobId;
    [Offset(5)] public byte JobLevel;
    [Offset(6)] public bool IsRoleAction;
    [Offset(7)] public bool IsPlayerAction;
    [Offset(8)] public bool IsPvP;

    public static SkillAction FromActionRow(Lumina.Excel.GeneratedSheets.Action action)
    {
        return new()
        {
            Id = action.RowId,
            IconId = action.Icon,
            Name = action.Name,
            Category = action.ActionCategory.Value?.Name.ToString() ?? "Unspecified",
            JobId = action.ClassJob.Value?.RowId ?? 0,
            JobLevel = action.ClassJobLevel,
            IsRoleAction = action.IsRoleAction,
            IsPlayerAction = action.IsPlayerAction,
            IsPvP = action.IsPvP,
        };
    }
}

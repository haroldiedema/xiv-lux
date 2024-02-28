/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     /
* Package: Lux.Plugin                              |    |___|    |  / /     \
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;

[Model]
public record Emote
{
    [Offset(0)] public uint Id;
    [Offset(1)] public ushort IconId;
    [Offset(2)] public string Name = string.Empty;

    public static Emote FromEmoteRow(Lumina.Excel.GeneratedSheets.Emote emote)
    {
        return new()
        {
            Id = emote.RowId,
            IconId = emote.Icon,
            Name = emote.Name,
        };
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;

namespace Lux.Models;//?

[Model]
public record EncounterParticipant
{
    [Offset(0)] public string Id      = string.Empty;
    [Offset(1)] public string Name    = string.Empty;
    [Offset(2)] public uint JobId     = 0;
    [Offset(3)] public uint DamageDone = 0;
    [Offset(4)] public uint DPS        = 0;
    [Offset(5)] public uint Duration   = 0;
}

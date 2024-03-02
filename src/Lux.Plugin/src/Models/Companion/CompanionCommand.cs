/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

namespace Lux.Models;

public enum CompanionCommand
{
    Unknown = 0,
    Follow = 3,
    FreeStance = 4,
    DefenderStance = 5,
    AttackerStance = 6,
    HealerStance = 7,
}
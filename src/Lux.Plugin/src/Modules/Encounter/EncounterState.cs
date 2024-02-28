/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

namespace Lux;

public enum EncounterState
{
    Inactive = 0, // Not tracking combat data.
    Passive  = 1, // Tracking but without the primary player as participant.
    Active = 2, // Tracking, with the primary player as participant.
}

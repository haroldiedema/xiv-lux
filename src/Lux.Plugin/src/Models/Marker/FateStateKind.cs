/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

public enum FateStateKind
{
    Unknown = 0,
    Running = 2,
    Ending = 3,
    Ended = 4,
    Failed = 5,
    Preparation = 7,
    WaitingForEnd = 8,
    Disposing = 9
}
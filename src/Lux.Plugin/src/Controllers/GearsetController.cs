/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Models;
using Lux.Server.Configuration;

namespace Lux.Controllers;

[Controller]
internal sealed class GearsetController(GearsetManager gsm, GameStateManager gs)
{
    [WebSocketEventStream("Gearset", 2)]
    public GearsetState? StreamGearsets()
    {
        if (! gs.IsLoggedIn) {
            return null;
        }

        return new GearsetState {
            CurrentIndex = gsm.GetCurrentGearset(),
            Gearsets = gsm.GetGearsets()
        };
    }

    [WebSocketCommand]
    public void SetCurrentGearset(int index)
    {
        gsm.SetCurrentGearset(index);
    }
}

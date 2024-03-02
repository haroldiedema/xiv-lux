/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Server.Configuration;
using Lux.Models;
using Dalamud.Plugin.Services;

namespace Lux.Controllers;

[Controller]
internal unsafe sealed class CompanionController(IClientState clientState, CompanionManager manager)
{
    
    [WebSocketCommand]
    public void Summon()
    {
        if (! clientState.IsLoggedIn) return;

        manager.Summon();
    }

    [WebSocketCommand]
    public void SetCommand(byte command)
    {
        if (! clientState.IsLoggedIn) return;

        manager.UseBuddyAction(command);
    }

    [WebSocketEventStream("CompanionState", 1)]
    public CompanionState? StreamCompanionState()
    {
        if (! clientState.IsLoggedIn) return null;

        return manager.GetCompanionState();
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using FFXIVClientStructs.FFXIV.Client.Game.UI;
using Lux.Server.Configuration;

namespace Lux.Controllers;

[Controller]
internal unsafe sealed class AetheryteController
{
    [WebSocketCommand]
    public void Teleport(uint id)
    {
        Telepo* telepo = Telepo.Instance();
        if (telepo == null) {
            Logger.Error("Telepo instance not found.");
            return;
        }

        try {
            telepo->Teleport(id, 0);
        } catch (Exception e) {
            Logger.Error("Failed to teleport: " + e.Message);
        }
    }
}

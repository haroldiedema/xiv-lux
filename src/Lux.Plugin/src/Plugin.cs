/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Plugin;
using Lux.Server;
using Lux.Server.Controller;

namespace Lux;

public sealed class Plugin : IDalamudPlugin
{
    public static string Name => "Lux";

    public Plugin(DalamudPluginInterface plugin)
    {
        ServiceContainer.Initialize(plugin);
        ControllerManager.RegisterControllers(plugin);
        WebServer.Start();
    }

    public void Dispose()
    {
        ServiceContainer.Dispose();
        ControllerManager.Dispose();
        WebServer.Stop();
    }
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Plugin.Services;

namespace Lux.Common;

[Service]
public sealed class Logger
{
    private static IPluginLog _logger = null!;

    public Logger(IPluginLog log)
    {
        _logger = log;
    }

    public static void Debug(string message)
    {
        _logger.Debug(message);
    }

    public static void Error(string message)
    {
        _logger.Error(message);
    }

    public static void Warning(string message)
    {
        _logger.Warning(message);
    }

    public static void Info(string message)
    {
        _logger.Info(message);
    }
}

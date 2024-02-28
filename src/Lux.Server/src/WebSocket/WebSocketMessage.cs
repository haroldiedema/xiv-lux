/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Collections.Generic;

namespace Lux.Server.WebSocket;

public sealed class WebSocketRequest
{
    public string Command { get; init; } = string.Empty;
    public int? Id { get; init; } = null;
    public List<object?> Arguments { get; init; } = [];
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Server.Configuration;

namespace Lux.Controllers;

[Controller]
internal sealed class ChatController(ChatReader reader, ChatSender sender)
{
    [WebSocketCommand]
    public void Send(string line)
    {
        sender.SendMessage(line);
    }

    [WebSocketEventStream("Chat", 30)]
    public object? StreamLastChatLine()
    {
        return reader.GetLastLines();
    }
}

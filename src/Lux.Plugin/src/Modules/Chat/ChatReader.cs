/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Game.Text;
using Dalamud.Game.Text.SeStringHandling;
using Dalamud.Plugin.Services;
using Lux.Models;

namespace Lux;

[Service]
internal sealed class ChatReader : IDisposable
{
    private readonly IChatGui ChatGui;
    private List<ChatLine> LastChatLines = [];

    public ChatReader(IChatGui chatGui)
    {
        ChatGui = chatGui;
        ChatGui.ChatMessageUnhandled += OnChatMessageUnhandled;
    }

    public void Dispose()
    {
        ChatGui.ChatMessageUnhandled -= OnChatMessageUnhandled;
    }

    public List<ChatLine> GetLastLines()
    {
        var lines = LastChatLines.ToList();
        LastChatLines.Clear();

        return lines;
    }

    private void OnChatMessageUnhandled(XivChatType type, uint senderId, SeString sender, SeString message)
    {
        lock (LastChatLines) {
            LastChatLines.Add(new ChatLine
            {
                Opcode = (short)type,
                Timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds(),
                Sender = sender.TextValue.Trim(),
                Message = message.TextValue.Trim()
            });
        }
    }
}
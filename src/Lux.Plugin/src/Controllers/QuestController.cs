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
internal sealed class QuestController(QuestManager questManager)
{
    [WebSocketEventStream("QuestMarkers", 2)]
    public List<QuestMarker> StreamQuestMarkers()
    {
        List<QuestMarker> markers = [];

        markers.AddRange(questManager.GetAcceptedQuestMarkers());
        markers.AddRange(questManager.GetUnacceptedQuestMarkers());
        markers.AddRange(questManager.GetQuestLinkMarkers());

        return markers;
    }
}

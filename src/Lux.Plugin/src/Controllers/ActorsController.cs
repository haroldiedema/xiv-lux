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
internal sealed class ActorsController(ActorManager actorManager)
{
    [WebSocketEventStream("PlayerActor", 30)]
    public PlayerActor? StreamPlayerActor()
    {
        return actorManager.GetPrimaryPlayer();
    }

    [WebSocketEventStream("PlayerActors", 30)]
    public List<PlayerActor> StreamPlayerActors()
    {
        return actorManager.PlayerActors;
    }

    [WebSocketEventStream("NpcActors", 30)]
    public List<NpcActor> StreamNpcActors()
    {
        return actorManager.NpcActors;
    }

    [WebSocketEventStream("GatheringNodeActors", 15)]
    public List<GatheringNodeActor> StreamGatheringNodeActors()
    {
        return actorManager.GatheringNodeActors;
    }
}

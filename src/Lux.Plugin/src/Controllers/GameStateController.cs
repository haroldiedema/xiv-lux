  /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Common.Model;
using Lux.Models;
using Lux.Server.Configuration;
using Lux.Server.Http;

namespace Lux.Controllers;

[Controller]
internal sealed class GameStateController(GameStateManager gsm)
{
    private readonly GameStateManager gameStateManager = gsm;

    [WebSocketEventStream("GameState", 60)]
    public GameState GetGameState()
    {
        return gameStateManager.GameState;
    }
}

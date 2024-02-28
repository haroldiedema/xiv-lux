/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Game.Text;
using Dalamud.Game.Text.SeStringHandling;
using Dalamud.Plugin.Services;
using Lux.Common.Model;

namespace Lux;

[Service]
internal sealed class EncounterManager: IDisposable
{
    public Models.Encounter? Encounter = null;

    private readonly GameStateManager _gameStateManager;
    private readonly ActorManager _actorManager;
    private readonly IChatGui _chatGui;
    private readonly EncounterParser parser;

    public EncounterManager(GameStateManager gameStateManager, ActorManager actorManager, IChatGui chatGui)
    {
        _gameStateManager = gameStateManager;
        _actorManager     = actorManager;
        _chatGui          = chatGui;

        parser = new(_actorManager);
        parser.OnEncounterUpdated += OnEncounterModelUpdated;

        gameStateManager.OnCombatStarted += OnCombatStarted;
        gameStateManager.OnCombatEnded   += OnCombatEnded;
        _chatGui.ChatMessageUnhandled    += OnChatMessageUnhandled;
    }

    public void Dispose()
    {
        parser.OnEncounterUpdated -= OnEncounterModelUpdated;
        parser.Dispose();
        
        _gameStateManager.OnCombatStarted -= OnCombatStarted;
        _gameStateManager.OnCombatEnded   -= OnCombatEnded;
        _chatGui.ChatMessageUnhandled     -= OnChatMessageUnhandled;
    }

    private void OnCombatStarted()
    {
    }

    private void OnCombatEnded()
    {
    }

    private void OnChatMessageUnhandled(XivChatType type, uint senderId, SeString sender, SeString message)
    {
        if ((uint)type < 2000) return;

        parser.AddMessage(message.ToString());
    }

    private void OnEncounterModelUpdated(Models.Encounter encounter)
    {
        Encounter = encounter;
    }
}

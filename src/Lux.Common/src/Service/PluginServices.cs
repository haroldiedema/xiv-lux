/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     / 
* Package: Lux.Common                              |    |___|    |  / /     \ 
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Dalamud.Game;
using Dalamud.Game.ClientState.Objects;
using Dalamud.Hooking;
using Dalamud.IoC;
using Dalamud.Plugin.Services;

namespace Lux.Common;

internal sealed class PluginServices
{
    [PluginService]
    public IPluginLog Log { get; private set; } = null!;

    [PluginService]
    public IAetheryteList AetheryteList { get; private set; } = null!;

    [PluginService]
    public IChatGui ChatGui { get; private set; } = null!;

    [PluginService]
    public IClientState ClientState { get; private set; } = null!;

    [PluginService]
    public ICommandManager CommandManager { get; private set; } = null!;

    [PluginService]
    public ICondition Condition { get; private set; } = null!;

    [PluginService]
    public IDataManager DataManager { get; private set; } = null!;

    [PluginService]
    public IDutyState DutyState { get; private set; } = null!;

    [PluginService]
    public IFateTable FateTable { get; private set; } = null!;

    [PluginService]
    public IFlyTextGui FlyTextGui { get; private set; } = null!;

    [PluginService]
    public IFramework Framework { get; private set; } = null!;

    [PluginService]
    public IGameConfig GameConfig { get; private set; } = null!;

    [PluginService]
    public IGameGui GameGui { get; private set; } = null!;

    [PluginService]
    public IGameInteropProvider GameInteropProvider { get; private set; } = null!;

    [PluginService]
    public IGameLifecycle GameLifecycle { get; private set; } = null!;

    [PluginService]
    public IGameNetwork GameNetwork { get; private set; } = null!;

    [PluginService]
    public IJobGauges JobGauges { get; private set; } = null!;

    [PluginService]
    public IKeyState KeyState { get; private set; } = null!;

    [PluginService]
    public IObjectTable ObjectTable { get; private set; } = null!;

    [PluginService]
    public IPartyFinderGui PartyFinderGui { get; private set; } = null!;

    [PluginService]
    public IPartyList PartyList { get; private set; } = null!;

    [PluginService]
    internal ISigScanner SigScanner { get; private set; } = null!;

    [PluginService]
    public ITargetManager TargetManager { get; private set; } = null!;

    [PluginService]
    public ITextureProvider TextureProvider { get; private set; } = null!;

    [PluginService]
    public ITitleScreenMenu TitleScreenMenu { get; private set; } = null!;

    [PluginService]
    public IToastGui ToastGui { get; private set; } = null!;
}

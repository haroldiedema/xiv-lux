/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     /
* Package: Lux.Plugin                              |    |___|    |  / /     \
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Dalamud.Game.ClientState.Conditions;
using Dalamud.Game.ClientState.Objects.SubKinds;
using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Client.UI.Agent;
using Lux.Common.Model;
using Lux.Models;

namespace Lux;

internal delegate void OnCombatStartedDelegate();
internal delegate void OnCombatEndedDelegate();

[Service] internal sealed class GameStateManager : IUpdatable, IDisposable
{
    public bool IsLoggedIn { get; private set; }
    public PlayerCharacter? Character { get; private set; }
    public GameState GameState { get; private set; }

    private readonly IClientState ClientState;
    private readonly ICondition Condition;
    private readonly IPartyList PartyList;
    private readonly ModelSerializer Serializer;

    internal event OnCombatStartedDelegate? OnCombatStarted;
    internal event OnCombatEndedDelegate? OnCombatEnded;

    public GameStateManager(IClientState clientState, ICondition condition, IPartyList partyList, ModelSerializer serializer)
    {
        ClientState = clientState;
        Condition   = condition;
        PartyList   = partyList;
        Serializer  = serializer;
        IsLoggedIn  = ClientState.IsLoggedIn;
        Character   = ClientState.LocalPlayer;
        GameState   = new GameState { 
            IsLoggedIn = IsLoggedIn,
            PlayerId   = Character?.ObjectId.ToString("X")
        };

        ClientState.Login         += OnLogin;
        ClientState.Logout        += OnLogout;
        Condition.ConditionChange += OnConditionChanged;
        
        UpdateGameStateFlags();
    }

    public void Dispose()
    {
        Character             = null;
        GameState.PlayerId    = null;
        GameState.IsLoggedIn  = false;
        ClientState.Login    -= OnLogin;
        ClientState.Logout   -= OnLogout;
    }
    
    public unsafe void OnUpdate()
    {
        if (! IsLoggedIn) {
            GameState.ZoneId = null;
            return;
        }

        var isInParty = PartyList.Count > 0;

        if (isInParty != GameState.IsInParty) {
            GameState.IsInParty = isInParty;
            UpdateGameStateFlags();
        }

        var agentMap = AgentMap.Instance();
        if (agentMap == null) return;

        if (agentMap->CurrentMapId != GameState.ZoneId) {
            GameState.ZoneId = agentMap->CurrentMapId;
            UpdateGameStateFlags();
        }
    }

    private void OnLogin()
    {
        IsLoggedIn           = true;
        Character            = ClientState.LocalPlayer;
        GameState.IsLoggedIn = true;
        GameState.PlayerId   = Character?.ObjectId.ToString("X");
        UpdateGameStateFlags();
    }

    private void OnLogout()
    {
        IsLoggedIn = false;
        Character  = null;

        GameState.PlayerId   = null;
        GameState.ZoneId     = null;
        GameState.IsLoggedIn = false;
        GameState.IsInParty  = false;

        UpdateGameStateFlags();
    }

    private void OnConditionChanged(ConditionFlag flag, bool value)
    {
        var WasInCombat = GameState.IsInCombat;
        UpdateGameStateFlags();

        if (WasInCombat != GameState.IsInCombat) {
            if (GameState.IsInCombat) {
                OnCombatStarted?.Invoke();
            } else {
                OnCombatEnded?.Invoke();
            }
        }
    }

    private void UpdateGameStateFlags()
    {
        GameState.IsInCutscene   = Condition[ConditionFlag.OccupiedInCutSceneEvent] || Condition[ConditionFlag.WatchingCutscene] || Condition[ConditionFlag.WatchingCutscene78];
        GameState.IsOccupied     = GameState.IsInCutscene || Condition[ConditionFlag.Occupied] || Condition[ConditionFlag.Occupied30] || Condition[ConditionFlag.OccupiedInEvent] || Condition[ConditionFlag.OccupiedSummoningBell] || Condition[ConditionFlag.Occupied30] || Condition[ConditionFlag.Occupied33] || Condition[ConditionFlag.Occupied38] || Condition[ConditionFlag.Occupied39] || Condition[ConditionFlag.UsingHousingFunctions];
        GameState.IsBetweenAreas = Condition[ConditionFlag.BetweenAreas];
        GameState.IsMounted      = Condition[ConditionFlag.Mounted];
        GameState.IsFlying       = Condition[ConditionFlag.InFlight];
        GameState.IsInDuty       = Condition[ConditionFlag.BoundByDuty] || Condition[ConditionFlag.BoundByDuty56] || Condition[ConditionFlag.BoundByDuty95];
        GameState.IsInCombat     = Condition[ConditionFlag.InCombat];
    }
}

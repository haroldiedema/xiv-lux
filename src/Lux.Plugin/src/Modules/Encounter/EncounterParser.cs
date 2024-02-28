/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Text.RegularExpressions;

namespace Lux;

internal delegate void EncounterUpdatedDelegate(Models.Encounter encounter);

internal sealed partial class EncounterParser : IDisposable
{
    public event EncounterUpdatedDelegate? OnEncounterUpdated;

    private EncounterState State                 = EncounterState.Inactive;
    private readonly List<EncounterEvent> events = [];
    
    private readonly Dictionary<string, Participant> participants = [];
    
    private readonly ActorManager actorManager;
    private readonly Timer Timer;
    private readonly Models.Encounter model = new();
    private long lastReceivedMessage = 0;
    private string? sourceCaster     = null;
    
    public EncounterParser(ActorManager actorManager)
    {
        this.actorManager = actorManager;

        Timer = new(OnTick, null, 1000, 1000);
    }

    public void Dispose()
    {
        participants.Clear();
        events.Clear();
        Timer.Dispose();
    }

    public void AddMessage(string message)
    {
        var skillUseMatch = SkillUseRegex().Match(message);
        if (skillUseMatch.Success) {
            sourceCaster = skillUseMatch.Groups["source"].Value;
            lastReceivedMessage = DateTimeOffset.Now.ToUnixTimeSeconds();
            return;
        }

        var autoAttackMatch = AutoAttackRegex().Match(message);
        if (autoAttackMatch.Success) {
            var source = autoAttackMatch.Groups["source"].Value;
            var target = autoAttackMatch.Groups["target"].Value;
            var damage = int.Parse(autoAttackMatch.Groups["damage"].Value);

            events.Add(new EncounterEvent { Source = source, Target = target, Damage = damage });
            lastReceivedMessage = DateTimeOffset.Now.ToUnixTimeSeconds();
            return;
        }

        var skillResultMatch = SkillResultRegex().Match(message);
        if (skillResultMatch.Success && sourceCaster != null) {
            var target = skillResultMatch.Groups["target"].Value;
            var damage = int.Parse(skillResultMatch.Groups["damage"].Value);

            events.Add(new EncounterEvent { Source = sourceCaster, Target = target, Damage = damage });
            lastReceivedMessage = DateTimeOffset.Now.ToUnixTimeSeconds();
            return;
        }
    }

    private void OnTick(object? _)
    {
        var now                      = DateTimeOffset.Now.ToUnixTimeSeconds();
        var secondsSinceLastActivity = now - lastReceivedMessage;

        if (secondsSinceLastActivity <= 1) {
            AggregateResultsFromPastSecond();

            if (State == EncounterState.Inactive && participants.Count == 0) {
                UpdateModel();
                return;
            }

              // Test if the primary player is a participant.
            var primaryPlayer = actorManager.GetPrimaryPlayer();
            if (primaryPlayer != null && participants.ContainsKey(primaryPlayer.Id)) {
                State = EncounterState.Active;
            } else {
                State = EncounterState.Passive;
            }
            UpdateModel();
            return;
        }

        if (State != EncounterState.Inactive && secondsSinceLastActivity >= 3) {
            State = EncounterState.Inactive;
            participants.Clear();
            events.Clear();
            UpdateModel();
        }
    }

    private void UpdateModel()
    {
        model.State = State;
        model.Participants.Clear();

        foreach (var participant in participants.Values) {
            model.Participants.Add(new Models.EncounterParticipant {
                Id         = participant.Player.Id,
                Name       = participant.Player.Name,
                JobId      = participant.Player.JobId,
                DamageDone = (uint) participant.TotalDamage,
                DPS        = participant.DamagePerSecond,
                Duration   = (uint) participant.Duration,
            });
        }
        
        OnEncounterUpdated?.Invoke(model);
    }

    private void AggregateResultsFromPastSecond()
    {
        var results = events.GroupBy(e => e.Source).Select(g => new {
            Source = g.Key,
            TotalDamage = g.Sum(e => e.Damage),
        });

        foreach (var result in results) {
            var player = actorManager.FindPlayerByName(result.Source);
            if (player == null) continue;

            if (false == participants.ContainsKey(player.Id)) {
                participants[player.Id] = new Participant {
                    Player      = player,
                    StartTime   = DateTimeOffset.Now.ToUnixTimeSeconds(),
                    DamageTicks = [],
                };
            }

            participants[player.Id].DamageTicks.Add(result.TotalDamage);
        }

        events.Clear();
    }

    [GeneratedRegex("^(?:(?:Direct hit!|Critical!|Critical direct hit!) ?)?(?:The )?(?<source>.+?) hit[s]? (?:The )?(?<target>.+?) for (?<damage>\\d+) damage.$", RegexOptions.Compiled | RegexOptions.IgnoreCase)]
    private static partial Regex AutoAttackRegex();

    [GeneratedRegex("^(?:The )?(?<source>.+?) (?:uses|use|casts|cast) (?<skill>.+).$", RegexOptions.Compiled | RegexOptions.IgnoreCase)]
    private static partial Regex SkillUseRegex();

    [GeneratedRegex(@"(?:The\s)?(?<target>\w+\s?\w+) takes (?<damage>\d+)(?:\(\+\d+%\)?)? damage\.", RegexOptions.Compiled | RegexOptions.IgnoreCase)]
    private static partial Regex SkillResultRegex();
}

internal sealed record EncounterEvent
{
    public string Source { get; init; } = string.Empty;
    public string Target { get; init; } = string.Empty;
    public int Damage { get; init; }    = 0;
}

internal sealed record Participant
{
    public Models.PlayerActor Player = null!;
    public List<decimal> DamageTicks = [];
    public long StartTime         = 0;
    
    public decimal TotalDamage => DamageTicks.Sum();

    public long Duration => DateTimeOffset.Now.ToUnixTimeSeconds() - StartTime;

    public uint DamagePerSecond
    {
        get
        {
            if (DamageTicks.Count == 0) return 0;
            
            var time = (decimal)(DateTimeOffset.Now.ToUnixTimeSeconds() - StartTime);
            if (time < 1) return (uint)TotalDamage;

            return (uint)(TotalDamage / time);
        }
    }

    public void Clear()
    {
        DamageTicks.Clear();
        StartTime = DateTimeOffset.Now.ToUnixTimeSeconds();
    }
}

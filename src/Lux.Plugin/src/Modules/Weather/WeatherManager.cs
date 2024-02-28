/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lumina.Excel.GeneratedSheets;
using Lux.Models;

namespace Lux;

[Service]
internal sealed class WeatherManager : IDisposable
{
    public List<WeatherForecast> CurrentZoneForecast { get; private set; }  = [];
    public List<WeatherForecast> SelectedZoneForecast { get; private set; } = [];

    private readonly ZoneManager _zoneManager;
    private readonly Timer _timer;

    private Zone? CurrentZone;
    private Zone? SelectedZone;

    public WeatherManager(ZoneManager zoneManager)
    {
        _zoneManager = zoneManager;
        _timer = new Timer(OnTick, null, 0, 1000);

        zoneManager.OnCurrentZoneChanged  += OnCurrentZoneChanged;
        zoneManager.OnSelectedZoneChanged += OnSelectedZoneChanged;
    }

    public void Dispose()
    {
        _timer.Dispose();

        _zoneManager.OnCurrentZoneChanged  -= OnCurrentZoneChanged;
        _zoneManager.OnSelectedZoneChanged -= OnSelectedZoneChanged;
    }

    public static List<WeatherForecast> GetForecastOfZone(Zone zone)
    {
        return BuildForecastModelFor(zone);
    }

    private void OnCurrentZoneChanged(Models.Zone? zone, Models.Zone? previousZone)
    {
        CurrentZone = zone;
    }

    private void OnSelectedZoneChanged(Models.Zone? zone, Models.Zone? previousZone)
    {
        SelectedZone = zone;
    }

    private void OnTick(object? _)
    {
        if (CurrentZone == null) {
            CurrentZoneForecast.Clear();
            SelectedZoneForecast.Clear();
            return;
        }

        CurrentZoneForecast = BuildForecastModelFor(CurrentZone);

        if (CurrentZone == SelectedZone) {
            SelectedZoneForecast = CurrentZoneForecast;
        } else if (SelectedZone != null) {
            SelectedZoneForecast = BuildForecastModelFor(SelectedZone);
        }
    }

    private static List<WeatherForecast> BuildForecastModelFor(Zone zone)
    {
        var forecast = GetForecast(zone);
        var model    = new List<WeatherForecast>();

        foreach (var (weather, time) in forecast) {
            model.Add(new WeatherForecast {
                Time   = FormatForecastTime(time),
                Name   = weather.Name,
                IconId = weather.Icon,
            });
        }

        return model;
    }

    private static IList<(Weather, DateTime)> GetForecast(Zone zone)
    {
        var weatherRate = ExcelSheet<WeatherRate>.Find(zone.WeatherRate);
        if (null == weatherRate) {
            return [];
        }

        return WeatherForecastProvider.GetForecast(weatherRate, 12);
    }

    private static string FormatForecastTime(DateTime forecastTime)
    {
        TimeSpan timeDifference = forecastTime - DateTime.UtcNow;
        double totalMinutes = timeDifference.TotalMinutes;

        if (totalMinutes <= 0.01)
        {
            return "Now";
        }
        else if (totalMinutes < 1)
        {
            return "In less than a minute";
        }
        else if (totalMinutes < 60)
        {
            return $"In {Math.Round(totalMinutes)} minute{(totalMinutes > 1 ? "s" : "")}";
        }
        else
        {
            int hours = (int)(totalMinutes / 60);
            int remainingMinutes = (int)(totalMinutes % 60);
            if (remainingMinutes == 0)
            {
                return $"In {hours} hour{(hours > 1 ? "s" : "")}";
            }
            else
            {
                return $"In {hours} hour{(hours > 1 ? "s" : "")} and {remainingMinutes} minute{(remainingMinutes > 1 ? "s" : "")}";
            }
        }
    }
}

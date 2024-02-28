/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author : Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lumina.Excel.GeneratedSheets;

namespace Lux;

public static class WeatherForecastProvider
{
    private const double Seconds = 1;
    private const double Minutes = 60 * Seconds;
    private const double WeatherPeriod = 23 * Minutes + 20 * Seconds;

    public static IList<(Weather, DateTime)> GetForecast(WeatherRate weatherRate, uint count = 1, double secondIncrement = WeatherPeriod, double initialOffset = 0 * Minutes)
    {
        if (count == 0) return Array.Empty<(Weather, DateTime)>();

        var current = GetCurrentWeather(weatherRate, initialOffset);
        if (current == null) return Array.Empty<(Weather, DateTime)>();

        var forecast = new List<(Weather, DateTime)> { current.Value };

        try {
            for (var i = 1; i < count; i++)
            {
                var time          = forecast[0].Item2.AddSeconds(i * secondIncrement);
                var weatherTarget = CalculateTarget(time);
                var weather       = GetWeatherFromRate(weatherRate, weatherTarget);

                if (weather == null) continue;

                forecast.Add((weather, time));
            }
        } catch (Exception) {
        }

        return forecast;
    }

    public static Weather? GetWeather(WeatherRate weatherRate, double initialOffset = 0 * Minutes)
    {
        var rootTime = GetRootTime(initialOffset);
        var target   = CalculateTarget(rootTime);

        return GetWeatherFromRate(weatherRate, target);
    }

    private static (Weather, DateTime)? GetCurrentWeather(WeatherRate weatherRate, double initialOffset = 0 * Minutes)
    {
        var rootTime = GetRootTime(initialOffset);
        var target   = CalculateTarget(rootTime);
        var weather  = GetWeatherFromRate(weatherRate, target);

        if (weather == null) return null;

        return (weather, rootTime);
    }

    private static Weather? GetWeatherFromRate(WeatherRate weatherRateIndex, int target)
    {
        int rateAccumulator = 0;
        int weatherId = -1;

        if (weatherRateIndex.UnkData0.Length == 0)
            return null;

        for (var i = 0; i < weatherRateIndex.UnkData0.Length; i++)
        {
            var w = weatherRateIndex.UnkData0[i];

            rateAccumulator += w.Rate;
            if (target < rateAccumulator)
            {
                weatherId = w.Weather;
                break;
            }
        }

        if (weatherId == -1)
        {
            return null;
        }

        return ExcelSheet<Weather>.All.ToList()[weatherId];
    }

    private static WeatherRate? GetWeatherRateFromTerritory(TerritoryType territoryType)
    {
        return ExcelSheet<WeatherRate>.All.ToList()[territoryType.WeatherRate];
    }

    private static DateTime GetRootTime(double initialOffset)
    {
        var now = DateTime.UtcNow;
        var rootTime = now.AddMilliseconds(-now.Millisecond).AddSeconds(initialOffset);
        var seconds = (long)(rootTime - DateTime.UnixEpoch).TotalSeconds % WeatherPeriod;

        rootTime = rootTime.AddSeconds(-seconds);

        return rootTime;
    }

    // https://github.com/xivapi/ffxiv-datamining/blob/master/docs/Weather.md
    private static int CalculateTarget(DateTime time)
    {
        var unix = (int)(time - DateTime.UnixEpoch).TotalSeconds;
        var bell = unix / 175;
        var increment = ((uint)(bell + 8 - (bell % 8))) % 24;

        var totalDays = (uint)(unix / 4200);
        var calcBase = (totalDays * 0x64) + increment;

        var step1 = (calcBase << 0xB) ^ calcBase;
        var step2 = (step1 >> 8) ^ step1;

        return (int)(step2 % 0x64);
    }
}

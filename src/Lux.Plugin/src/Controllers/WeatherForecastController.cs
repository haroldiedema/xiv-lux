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
internal sealed class WeatherForecastController(WeatherManager wm)
{
    [WebSocketEventStream("CurrentWeatherForecast", 1)]
    public List<WeatherForecast> StreamCurrentWeatherForecast()
    {
        return wm.CurrentZoneForecast;
    }
}

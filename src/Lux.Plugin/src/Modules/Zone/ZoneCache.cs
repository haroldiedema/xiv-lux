    /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Models;

namespace Lux;

[Service]
internal sealed class ZoneCache(ZoneFactory factory) : IDisposable
{
    private readonly Dictionary<uint, Zone> Cache = [];

    private readonly ZoneFactory Factory = factory;

    public Zone GetZone(uint mapId)
    {
        if (Cache.TryGetValue(mapId, out Zone? value))
        {
            return value;
        }

        return Cache[mapId] = Factory.Make(mapId);
    }

    public void Dispose()
    {
        Cache.Clear();
    }
}

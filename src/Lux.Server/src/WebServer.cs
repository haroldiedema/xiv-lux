/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Lux.Server.Http;

namespace Lux.Server;

public static class WebServer
{
	private static HttpServer? _httpServer;

	public static void Start()
	{
		_httpServer = new HttpServer(51337);
	}

	public static void Stop()
	{
		_httpServer?.Dispose();
		_httpServer = null;
	}
}

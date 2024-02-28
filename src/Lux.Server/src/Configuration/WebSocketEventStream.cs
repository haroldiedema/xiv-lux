/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;

namespace Lux.Server.Configuration;

[AttributeUsage(AttributeTargets.Method)]
public class WebSocketEventStream(string name, int tickRate) : Attribute
{
    public string Name = name;
    public int TickRate = 1000 / tickRate;
}

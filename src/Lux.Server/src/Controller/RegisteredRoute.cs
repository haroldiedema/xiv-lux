/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Reflection;
using System.Text.RegularExpressions;

namespace Lux.Server.Controller;

public sealed class RegisteredRoute(string method, Regex pattern, string name, object? controller, MethodInfo methodInfo)
{
    public string Name { get; } = name;
    public string Method { get; } = method;
    public Regex Pattern { get; } = pattern;

    public object? Controller { get; } = controller;
    public MethodInfo MethodInfo { get; } = methodInfo;
}

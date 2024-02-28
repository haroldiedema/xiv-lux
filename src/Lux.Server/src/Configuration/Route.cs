/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Text.RegularExpressions;

namespace Lux.Server.Configuration;

[AttributeUsage(AttributeTargets.Method)]
public partial class Route : Attribute
{
    public string Method { get; }
    public Regex Pattern { get; }

    public Route(string method, string path)
    {
        Method = method.ToUpper();
        Pattern = CreatePattern(path);
    }

    public Route(string path)
    {
        Method = "GET";
        Pattern = CreatePattern(path);
    }

    private static Regex CreatePattern(string path)
    {
        return new Regex("^" + GeneratedRegex().Replace(path.Replace("/", "\\/"), @"(?<$1>\w+)") + "$");
    }

    [GeneratedRegex("\\{(\\w+)\\}")]
    private static partial Regex GeneratedRegex();
}

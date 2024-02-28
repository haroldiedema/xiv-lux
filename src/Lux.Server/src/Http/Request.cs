/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Collections.Generic;
using System.Net;
using Lux.Common;
using Lux.Server.Controller;

namespace Lux.Server.Http;

public sealed class Request
{
    public readonly HttpListenerRequest NativeRequest;

    public readonly string Method;

    public readonly string Path;

    private readonly Dictionary<string, string> _headers = new();

    public Request(HttpListenerRequest request)
    {
        this.NativeRequest = request;
        this.Method = request.HttpMethod.ToUpper();
        this.Path = request.Url?.AbsolutePath ?? "/";

        foreach (var key in request.Headers.AllKeys)
        {
            if (key == null) continue;

            _headers[key.ToLower()] = request.Headers[key]!;
        }
    }

    public string? GetHeader(string name)
    {
        return _headers.TryGetValue(name.ToLower(), out var value) ? value : null;
    }

    public string? GetQueryParameter(string name)
    {
        return this.NativeRequest.QueryString.Get(name);
    }

    public bool IsWebSocketRequest()
    {
        return this.NativeRequest.IsWebSocketRequest;
    }

    public bool IsMatchingRoute(RegisteredRoute route)
    {
        return route.Method == this.Method && route.Pattern.IsMatch(this.Path);
    }
}

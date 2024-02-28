/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Lux.Server.Controller;

namespace Lux.Server.Http;

public sealed class Router
{
    public Router()
    {
    }

    public static async Task<Response?> Process(Request request)
    {
        var route = ControllerManager.FindRouteMathing(request);
        if (route == null) return null;

        var match = route.Pattern.Match(request.Path);
        List<object> arguments = [];

        foreach (var parameter in route.MethodInfo.GetParameters())
        {
            if (parameter.ParameterType == typeof(Request))
            {
                arguments.Add(request);
                continue;
            }

            if (null != parameter.Name && match.Groups.ContainsKey(parameter.Name))
            {
                arguments.Add(Convert.ChangeType(match.Groups[parameter.Name].Value, parameter.ParameterType));
            }
        }

        Task<object?> task = Task.Run(() => route.MethodInfo.Invoke(route.Controller, [.. arguments]));

        object? result = await task;

        if (result is not Response response)
        {
            throw new Exception($"Controller method \"{route.MethodInfo.DeclaringType?.Name ?? "?"}::{route.MethodInfo.Name}\" must return a Response object.");
        }

        return response;
    }
}

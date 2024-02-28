/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Collections.Generic;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Lux.Common.Model;
using Lux.Server.WebSocket;

namespace Lux.Server.Controller;

public sealed class RegisteredCommand(string name, object? controller, MethodInfo methodInfo)
{
    public string Name { get; } = name;
    public object? Controller { get; } = controller;
    public MethodInfo MethodInfo { get; } = methodInfo;

    public async Task<object?> Invoke(Client client, List<object?> inputArgs)
    {
        var parameters = MethodInfo.GetParameters();
        var parsedArgs = new List<object>();
        var argIndex = 0;
        var argOffset = 0;

        for (var i = 0; i < parameters.Length; i++)
        {
            var parameter = parameters[i];

            if (parameter.ParameterType == typeof(Client))
            {
                parsedArgs.Add(client);
                argOffset++;
                continue;
            }

            if (argIndex >= inputArgs.Count) break;

            var json = JsonSerializer.Serialize(inputArgs[argIndex]);
            try
            {
                parsedArgs.Add(JsonSerializer.Deserialize(json, parameter.ParameterType) ?? null!);
            }
            catch
            {
                throw new System.Exception($"Invalid argument type for parameter #{1 + (i - argOffset)} \"{parameter.Name}\". Expected: {parameter.ParameterType.Name}.");
            }
            argIndex++;
        }

        if (parsedArgs.Count != parameters.Length)
        {
            List<string> signature = [];
            foreach (var parameter in parameters)
            {
                if (parameter.ParameterType.Name != "Client")
                {
                    signature.Add(parameter.ParameterType.Name);
                }
            }

            throw new System.Exception($"Invalid number of arguments. Received only {parsedArgs.Count - argOffset} but expected {parameters.Length - argOffset} <{string.Join(", ", signature)}>.");
        }

        return await Task.Run(() =>
        {
            return ModelSerializer.Instance.Serialize(MethodInfo.Invoke(Controller, [.. parsedArgs]));
        });
    }
}

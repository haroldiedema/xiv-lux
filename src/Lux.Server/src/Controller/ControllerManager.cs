/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Dalamud.Plugin;
using Lux.Common;
using Lux.Server.Http;
using Lux.Server.WebSocket;
using Config = Lux.Server.Configuration;

namespace Lux.Server.Controller;

public static class ControllerManager
{
    private static List<object> _controllers = [];
    private static Dictionary<string, RegisteredRoute> _routes = [];
    private static Dictionary<string, RegisteredCommand> _commands = [];
    private static Dictionary<string, RegisteredEventStream> _eventStreams = [];

    public static void RegisterControllers(DalamudPluginInterface plugin)
    {
        var assembly = Assembly.GetCallingAssembly();

        Logger.Debug($"Scanning assembly {assembly.GetName().Name} for controllers...");

        assembly.GetTypes()
            .Where(t => t.GetCustomAttribute<Config.Controller>() != null)
            .ToList().ForEach(ProcessController);

        if (plugin.IsDev) {
            BuildTypescriptInvokerClass(plugin);
            BuildTypescriptEventStreamTypes(plugin);
        }
    }

    public static void Dispose()
    {
        try
        {
            _eventStreams.Values.ToList().ForEach(s => s.Dispose());
            _controllers.ForEach(c => (c as IDisposable)?.Dispose());
        }
        catch { }

        _controllers.Clear();
        _routes.Clear();
        _commands.Clear();
        _eventStreams.Clear();
    }

    public static RegisteredRoute? FindRouteMathing(Request request)
    {
        return _routes.Values.FirstOrDefault(route => request.IsMatchingRoute(route));
    }

    public static void AddEventStreamRecipient(Client client)
    {
        _eventStreams.Values.ToList().ForEach(s => s.AddRecipient(client));
    }

    public static async Task<object?> ProcessCommand(Client client, string command, List<object?> arguments)
    {
        if (!_commands.TryGetValue(command, out var registeredCommand))
        {
            throw new Exception($"No command with the name {command} found.");
        }

        return await registeredCommand.Invoke(client, arguments);
    }

    private static void ProcessController(Type type)
    {
        var controller = ServiceContainer.CompileAndGet(type);
        if (controller == null)
        {
            Logger.Error($"Failed to create instance of controller {type.Name}");
            return;
        }

        _controllers.Add(controller);

        type.GetMethods()
            .Where(m => m.GetCustomAttribute<Config.Route>() != null).ToList()
            .ForEach(method => TryAddRoute(type, method, controller));

        type.GetMethods()
            .Where(m => m.GetCustomAttribute<Config.WebSocketCommand>() != null).ToList()
            .ForEach(method => TryAddWebSocketCommand(type, method, controller));

        type.GetMethods()
            .Where(m => m.GetCustomAttribute<Config.WebSocketEventStream>() != null).ToList()
            .ForEach(method => TryAddWebSocketEventStream(type, method, controller));
    }

    private static void TryAddRoute(Type type, MethodInfo method, object controller)
    {
        var route = method.GetCustomAttribute<Config.Route>()!;
        var name = GenerateName(type, method);

        if (_routes.ContainsKey(name))
        {
            Logger.Error($"Another route with the name {name} already exists.");
            return;
        }

        _routes.Add(name, new RegisteredRoute(route.Method, route.Pattern, name, controller, method));
    }

    private static void TryAddWebSocketCommand(Type type, MethodInfo method, object controller)
    {
        var command = method.GetCustomAttribute<Config.WebSocketCommand>()!;
        var name = GenerateName(type, method);

        if (_commands.ContainsKey(name))
        {
            Logger.Error($"Another command with the name {name} already exists.");
            return;
        }

        _commands.Add(name, new RegisteredCommand(name, controller, method));
    }

    private static void TryAddWebSocketEventStream(Type type, MethodInfo method, object controller)
    {
        var command = method.GetCustomAttribute<Config.WebSocketEventStream>()!;
        var name    = command.Name;

        if (_eventStreams.ContainsKey(name))
        {
            Logger.Error($"Another event stream with the name {name} already exists.");
            return;
        }

        _eventStreams.Add(name, new RegisteredEventStream(name, command.TickRate, controller, method));
    }

    private static string GenerateName(Type type, MethodInfo method)
    {
        return $"{type.Name.Replace("Controller", "")}.{method.Name}";
    }

    private static void BuildTypescriptEventStreamTypes(DalamudPluginInterface plugin)
    {
        var path = new FileInfo(Path.Combine(plugin.AssemblyLocation.DirectoryName!, "..\\ui\\src\\System\\Socket\\EventStreamTypes.ts"));

        Logger.Info($"Building TypeScript event stream types at {path.FullName}...");

        var file = new StreamWriter(path.FullName);

        file.WriteLine("/* This file is automatically generated by Lux. Do not modify. */");
        file.WriteLine();
        file.WriteLine("import * as Model from '@/XIV/Models/Generated';");
        file.WriteLine();
        file.WriteLine("export type EventStreamType = {");

        foreach (var kvp in _eventStreams)
        {
            var returnType = ConvertTypeToTypescriptType(kvp.Value.MethodInfo.ReturnType);
            file.WriteLine($"    '{kvp.Key}': {(returnType.IsModel ? "Model." : "")}{returnType.Name}{(returnType.IsArray ? "[]" : "")};");
        }

        file.WriteLine("}");
        file.Close();
    }

    private static void BuildTypescriptInvokerClass(DalamudPluginInterface plugin)
    {
        var path = new FileInfo(Path.Combine(plugin.AssemblyLocation.DirectoryName!, "..\\ui\\src\\System\\Socket\\Invoker.ts"));

        Logger.Info($"Building TypeScript invoker class at {path.FullName}...");

        var file = new StreamWriter(path.FullName);

        file.WriteLine("/* This file is automatically generated by Lux. Do not modify. */");
        file.WriteLine();

        file.WriteLine("import { Inject, Service } from '@/System/Services';");
        file.WriteLine("import { Socket }          from '@/System/Socket/Socket';");
        file.WriteLine("import * as Model          from '@/XIV/Models/Generated';");
        file.WriteLine();

        file.WriteLine("@Service()");
        file.WriteLine("export class Invoker");
        file.WriteLine("{");
        file.WriteLine("    @Inject private readonly socket: Socket;");
        file.WriteLine();

        Dictionary<string, List<MethodInfo>> list = [];

        foreach (var kvp in _commands) {
            var category   = kvp.Key.Split('.')[0];
            
            if (! list.ContainsKey(category)) {
                list[category] = [];
            }

            list[category].Add(kvp.Value.MethodInfo);
        }

        foreach (var kvp in list) {
            var categoryName = kvp.Key[0].ToString().ToLower() + kvp.Key[1..];
            file.WriteLine($"    public {categoryName} = {{");

            foreach (var method in kvp.Value) {
                file.WriteLine(BuildInvokerMethod(kvp.Key, method));
            }

            file.WriteLine("    } as const;");
        }

        file.WriteLine("}");
        file.Close();
    }

    private static string BuildInvokerMethod(string category, MethodInfo method)
    {
        List<TypescriptParameter> parameters = GetParameters(method);
        TypescriptType returnType = ConvertTypeToTypescriptType(method.ReturnType);

        var signature        = string.Join(", ", parameters.Select(p => $"{p.Name}: {p.Type.Name}"));
        var parametersString = string.Join(", ", parameters.Select(p => p.Name));
        var returns          = $"Promise<{(returnType.IsModel ? "Model." : "")}{returnType.Name}{(returnType.IsArray ? "[]" : "")}>";
        var methodName       = method.Name[0].ToString().ToLower() + method.Name[1..];

        return $"        {methodName}: ({signature}): {returns} => this.socket.invoke('{category}.{method.Name}', [{parametersString}]),";
    }

    private static List<TypescriptParameter> GetParameters(MethodInfo method)
    {
        return method.GetParameters().Select(p => new TypescriptParameter(p.Name!, ConvertTypeToTypescriptType(p.ParameterType))).ToList();
    }

    private static TypescriptType ConvertTypeToTypescriptType(Type type, bool isArray = false)
    {
        if (type == typeof(string)) return new TypescriptType("string", false, isArray);
        if (type == typeof(int)) return new TypescriptType("number", false, isArray);
        if (type == typeof(bool)) return new TypescriptType("boolean", false, isArray);
        if (type == typeof(float)) return new TypescriptType("number", false, isArray);
        if (type == typeof(double)) return new TypescriptType("number", false, isArray);
        if (type == typeof(decimal)) return new TypescriptType("number", false, isArray);
        if (type == typeof(long)) return new TypescriptType("number", false, isArray);
        if (type == typeof(short)) return new TypescriptType("number", false, isArray);
        if (type == typeof(byte)) return new TypescriptType("number", false, isArray);
        if (type == typeof(sbyte)) return new TypescriptType("number", false, isArray);
        if (type == typeof(uint)) return new TypescriptType("number", false, isArray);
        if (type == typeof(ulong)) return new TypescriptType("number", false, isArray);
        if (type == typeof(ushort)) return new TypescriptType("number", false, isArray);
        if (type == typeof(char)) return new TypescriptType("string", false, isArray);
        if (type == typeof(DateTime)) return new TypescriptType("string", false, isArray);
        if (type == typeof(TimeSpan)) return new TypescriptType("string", false, isArray);
        if (type == typeof(Guid)) return new TypescriptType("string", false, isArray);
        if (type.IsArray) return ConvertTypeToTypescriptType(type.GetElementType()!, true);
        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>)) {
            return ConvertTypeToTypescriptType(type.GetGenericArguments()[0], true);
        }

        if (type.IsClass && type.Namespace != null && type.Namespace.StartsWith("Lux.Models")) {
            return new TypescriptType(type.Name, true, isArray);
        }

        return new TypescriptType("any");
    }

    private record TypescriptParameter(string Name, TypescriptType Type);
    private record TypescriptType(string Name, bool IsModel = false, bool IsArray = false);
}
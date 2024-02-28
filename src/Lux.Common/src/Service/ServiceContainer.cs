/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Dalamud.Plugin;
using Dalamud.Plugin.Services;

namespace Lux.Common;

public static class ServiceContainer
{
    private static readonly List<Assembly> _assemblies = [];
    private static readonly Dictionary<Type, object> _services = [];
    private static readonly List<Type> _initialized = [];
    private static readonly PluginServices _pluginServices = new();

    public static void Initialize(DalamudPluginInterface dalamud)
    {
        if (!dalamud.Inject(_pluginServices)) {
            throw new Exception("Failed to inject plugin services.");
        }

        _services[typeof(DalamudPluginInterface)] = dalamud;

        _pluginServices.GetType().GetProperties().ToList().ForEach(p => {
            _services[p.PropertyType] = p.GetValue(_pluginServices)!;
            _pluginServices.Log.Debug($"Initialized service '{p.PropertyType.FullName}'.");
        });

        AssemblyList AssemblyList = new(Assembly.GetExecutingAssembly(), Assembly.GetCallingAssembly());
        _services[typeof(AssemblyList)] = AssemblyList;

        CompileFromAssembly(AssemblyList.CommonAssembly); // Self.
        CompileFromAssembly(AssemblyList.PluginAssembly); // Plugin.

        _pluginServices.Framework.Update += OnUpdate;
    }

    public static void Dispose()
    {
        _pluginServices.Framework.Update -= OnUpdate;
        _services.Values.ToList().ForEach(s => (s as IDisposable)?.Dispose());
        _services.Clear();
    }

    public static T Get<T>() => (T) _services[typeof(T)] ?? throw new Exception($"Service '{typeof(T).FullName}' not found.");

    public static object CompileAndGet(Type type) => CompileService(type);

    private static void CompileFromAssembly(Assembly assembly)
    {
        if (_assemblies.Contains(assembly)) return;

        _assemblies.Add(assembly);

        assembly.GetTypes().Where(t => t.GetCustomAttribute<Service>() != null)
            .ToList().ForEach(type => CompileService(type));
    }

    private static object CompileService(Type type)
    {
        if (_services.ContainsKey(type)) {
            return _services[type];
        }

        if (_initialized.Contains(type))
        {
            throw new Exception($"Circular dependency detected while initializing service '{type.FullName}'.");
        }
        _initialized.Add(type);

        var constructor = type.GetConstructors().FirstOrDefault()
            ?? throw new Exception($"Service '{type.FullName}' does not have a public constructor.");

        var parameters = constructor.GetParameters().Select(p => CompileService(p.ParameterType)).ToArray();
        _services[type] = constructor.Invoke(parameters);

        _initialized.Remove(type);

        return _services[type];
    }

    private static void OnUpdate(IFramework framework)
    {
        _services.Values.ToList().OfType<IUpdatable>().ToList().ForEach(s => s.OnUpdate());
    }
}

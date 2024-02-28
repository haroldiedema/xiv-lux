/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Reflection;

namespace Lux.Common;

public sealed class AssemblyList(Assembly commonAssembly, Assembly pluginAssembly)
{
    public readonly Assembly CommonAssembly = commonAssembly;
    public readonly Assembly PluginAssembly = pluginAssembly;
}

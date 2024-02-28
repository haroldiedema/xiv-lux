/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Text.Json;
using NativeSerializer = System.Text.Json.JsonSerializer;

namespace Lux.Common;

public static class JsonSerializer
{
    private readonly static JsonSerializerOptions OutputOptions = new()
    {
        AllowTrailingCommas         = false,
        IncludeFields               = true,
        WriteIndented               = true,
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy        = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy         = JsonNamingPolicy.CamelCase,
    };

    private readonly static JsonSerializerOptions InputOptions = new()
    {
        AllowTrailingCommas         = true,
        PropertyNameCaseInsensitive = true,
    };

    public static string Serialize<T>(T obj)
    {
        return NativeSerializer.Serialize(obj, OutputOptions);
    }

    public static T Deserialize<T>(string json)
    {
        return NativeSerializer.Deserialize<T>(json, InputOptions)!;
    }

    public static byte[] SerializeToUtf8Bytes<T>(T obj)
    {
        return NativeSerializer.SerializeToUtf8Bytes(obj, OutputOptions);
    }
}

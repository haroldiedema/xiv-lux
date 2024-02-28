/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Text.Json;

namespace Lux.Server.WebSocket;

public sealed class WebSocketResponse(int? id, object? value, bool isError = false)
{
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        AllowTrailingCommas = false,
        WriteIndented = false,
    };

    public WebSocketMessageKind Kind { get; } = WebSocketMessageKind.Response;
    public int? Id { get; init; } = id;
    public bool IsError { get; init; } = isError;
    public object? Value { get; init; } = value;

    public static WebSocketResponse ErrorForRequest(WebSocketRequest request, string value)
    {
        return new WebSocketResponse(request.Id, value, true);
    }

    public static WebSocketResponse ErrorForRequest(int id, Exception exception)
    {
        return new WebSocketResponse(id, exception.Message + " - " + exception.StackTrace, true);
    }

    public static WebSocketResponse ErrorForRequest(WebSocketRequest request, Exception exception)
    {
        return new WebSocketResponse(request.Id, exception.Message + " - " + exception.StackTrace, true);
    }

    public static WebSocketResponse ForRequest(WebSocketRequest request, object? value)
    {
        return new WebSocketResponse(request.Id, value);
    }

    public static WebSocketResponse ForRequest(WebSocketRequest request)
    {
        return new WebSocketResponse(request.Id, null);
    }

    public byte[] GetBytes()
    {
        return JsonSerializer.SerializeToUtf8Bytes(this, JsonOptions);
    }
}

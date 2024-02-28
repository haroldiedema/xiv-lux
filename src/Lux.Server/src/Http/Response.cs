/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Lux.Common;

namespace Lux.Server.Http;

public class Response
{
    private readonly Dictionary<string, string> _headers = [];
    private int _statusCode = 200;
    private string _contentType = "text/plain";
    private byte[]? _body;

    public Response SetHeader(string name, string value)
    {
        _headers.Add(name, value);

        return this;
    }

    public Response SetStatus(int statusCode)
    {
        _statusCode = statusCode;

        return this;
    }

    public Response SetTextContent(string content, string contentType = "text/plain")
    {
        _body = System.Text.Encoding.UTF8.GetBytes(content);
        _contentType = contentType;

        return this;
    }

    public Response SetBinaryContent(byte[] content, string contentType)
    {
        _body = content;
        _contentType = contentType;

        return this;
    }

    public Response SetJsonContent(object? content)
    {
        _body = System.Text.Encoding.UTF8.GetBytes(JsonSerializer.Serialize(content));
        _contentType = "application/json";

        return this;
    }

    public Response EnableCache()
    {
        _headers.Remove("Cache-Control");
        _headers.Remove("Expires");
        _headers.Remove("Pragma");

        _headers.Add("Cache-Control", "public, max-age=31536000");
        _headers.Add("Expires", DateTime.UtcNow.AddYears(1).ToString("R"));

        return this;
    }

    public Response DisableCache()
    {
        _headers.Remove("Cache-Control");
        _headers.Remove("Expires");
        _headers.Remove("Pragma");

        _headers.Add("Cache-Control", "no-cache, no-store, must-revalidate");
        _headers.Add("Pragma", "no-cache");
        _headers.Add("Expires", "0");

        return this;
    }

    public async ValueTask End(HttpListenerResponse NativeResponse)
    {
        // Add CORS headers.
        NativeResponse.AddHeader("Access-Control-Allow-Origin", "*");
        NativeResponse.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        NativeResponse.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (_body == null)
        {
            NativeResponse.StatusCode = 404;
            NativeResponse.StatusDescription = "Not Found";
            NativeResponse.Close();
            return;
        }

        NativeResponse.StatusCode = _statusCode;
        NativeResponse.ContentType = _contentType;
        NativeResponse.ContentLength64 = _body.Length;

        foreach (var (key, value) in _headers)
        {
            NativeResponse.AddHeader(key, value);
        }

        try
        {
            await NativeResponse.OutputStream.WriteAsync(_body);
        }
        catch (Exception e)
        {
            Logger.Error($"Error writing response body: {e.Message}");
        }
        finally
        {
            if (!NativeResponse.KeepAlive)
            {
                NativeResponse.Close();
            }
        }
    }
}

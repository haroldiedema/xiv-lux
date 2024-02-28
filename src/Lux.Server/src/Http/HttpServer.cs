/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Net;
using System.Threading.Tasks;
using Lux.Common;
using Lux.Server.WebSocket;

namespace Lux.Server.Http;

public class HttpServer
{
    public readonly HttpListener Listener;

    private bool _isDisposed = false;

    public HttpServer(int port)
    {
        AssetServer.Initialize();

        Listener = new HttpListener();

        Listener.Prefixes.Add($"http://localhost:{port}/");
        Listener.Start();

        Task listenTask = HandleIncomingConnections();
        listenTask.ContinueWith(OnAfterStopListening);
    }

    public void Dispose()
    {
        AssetServer.Dispose();

        if (Listener.IsListening)
        {
            Listener.Stop();
            Listener.Close();
        }
    }

    private async Task HandleIncomingConnections()
    {
        while (!_isDisposed)
        {
            var ctx = await Listener.GetContextAsync();
            var req = new Request(ctx.Request);

            if (req.IsWebSocketRequest())
            {
                await WebSocketServer.ProcessWebSocketRequest(ctx);
                continue;
            }

            try
            {
                var response = await Router.Process(req);
                if (response != null)
                {
                    await response.End(ctx.Response);
                    continue;
                }

                await AssetServer.GetAsset(req.Path).End(ctx.Response);
            }
            catch (System.Exception e)
            {
                Logger.Error($"Error processing request: {e.Message}");
                ctx.Response.StatusCode = 500;
                ctx.Response.StatusDescription = "Internal Server Error";
                ctx.Response.Close();
            }
        }
    }

    private void OnAfterStopListening(Task task)
    {
        if (task.IsFaulted)
        {
            var message = task.Exception?.Message ?? "Unknown error";

            // Don't log thread exit errors.
            if (!message.Contains("thread exit")) Logger.Error($"Error in HTTP server: {task.Exception?.Message ?? "Unknown error"}");
        }

        if (Listener.IsListening) Listener.Close();
    }
}

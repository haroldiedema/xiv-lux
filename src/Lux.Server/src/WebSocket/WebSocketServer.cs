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
using Lux.Server.Controller;

namespace Lux.Server.WebSocket;

public static class WebSocketServer
{
    private static List<Client> _clients = [];

    public static async Task ProcessWebSocketRequest(HttpListenerContext ctx)
    {
        var client = new Client((await ctx.AcceptWebSocketAsync(null)).WebSocket);

        _clients.Add(client);
        client.OnDisposed += OnClientDisposed;
        client.OnMessage += OnClientMessage;

        ControllerManager.AddEventStreamRecipient(client);
    }

    private static void OnClientDisposed(Client client)
    {
        client.OnDisposed -= OnClientDisposed;

        _clients.Remove(client);
    }

    private static async void OnClientMessage(Client client, WebSocketRequest message)
    {
        if (null == message.Id)
        {
            client.Send(WebSocketResponse.ErrorForRequest(message, "No Request ID provided.")).Wait();
            return;
        }

        try
        {
            var response = await ControllerManager.ProcessCommand(client, message.Command, message.Arguments);
            client.Send(WebSocketResponse.ForRequest(message, response)).Wait();
        }
        catch (Exception e)
        {
            client.Send(WebSocketResponse.ErrorForRequest(message, e)).Wait();
            return;
        }
    }
}

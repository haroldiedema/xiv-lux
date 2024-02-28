/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Lux.Common;
using Native = System.Net.WebSockets;

namespace Lux.Server.WebSocket;

public sealed class Client : IDisposable
{
    public event OnClientDisposed? OnDisposed;
    public event OnClientMessage? OnMessage;
    private Native.WebSocket WebSocket { get; }
    private ConcurrentQueue<byte[]> _sendQueue = new();
    private SemaphoreSlim _sendSemaphore = new(1);

    public Client(Native.WebSocket webSocket)
    {
        WebSocket = webSocket;

        Task task = Task.Run(Tick);
    }

    public void Dispose()
    {
        try
        {
            if (WebSocket.State == Native.WebSocketState.Open) WebSocket.CloseAsync(Native.WebSocketCloseStatus.NormalClosure, "Goodbye", default).Wait();

            WebSocket.Dispose();
        }
        catch { }

        OnDisposed?.Invoke(this);
    }

    public async Task Send(WebSocketResponse response)
    {
        await Send(TrySerializeResponse(response));
    }

    public async Task Send(byte[] bytes)
    {
        if (WebSocket.State != Native.WebSocketState.Open)
        {
            Logger.Warning("WebSocket is not open. Cannot send message.");
            Dispose();
            return;
        }

        _sendQueue.Enqueue(bytes);

        if (_sendQueue.Count > 10)
        {
            Logger.Warning($"Backpressure detected in send queue! {_sendQueue.Count} messages in queue.");
        }

        await ProcessSendQueue();
    }

    private async Task ProcessSendQueue()
    {
        await _sendSemaphore.WaitAsync();

        try
        {
            while (_sendQueue.TryDequeue(out var bytes))
            {
                await WebSocket.SendAsync(bytes, Native.WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
        finally
        {
            _sendSemaphore.Release();
        }
    }

    private async Task Tick()
    {
        while (WebSocket.State == Native.WebSocketState.Open)
        {
            var buffer = new byte[1024];
            var result = await WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == Native.WebSocketMessageType.Close)
            {
                Dispose();
                break;
            }

            var message = TryParseMessage(System.Text.Encoding.UTF8.GetString(buffer, 0, result.Count));
            if (null == message || message.Command == String.Empty) break;

            OnMessage?.Invoke(this, message);
        }

        Dispose();
    }

    private static WebSocketRequest? TryParseMessage(string message)
    {
        try
        {
            return JsonSerializer.Deserialize<WebSocketRequest>(message);
        }
        catch (System.Exception e)
        {
            Logger.Error($"Error parsing message: {e.Message}");
            return null;
        }
    }

    private static byte[] TrySerializeResponse(WebSocketResponse response)
    {
        try
        {
            return response.GetBytes();
        }
        catch (System.Exception e)
        {
            Logger.Error($"Error serializing response: {e.Message}");
            return new WebSocketResponse(response.Id, e.Message, true).GetBytes();
        }
    }
}

public delegate void OnClientDisposed(Client client);
public delegate void OnClientMessage(Client client, WebSocketRequest message);
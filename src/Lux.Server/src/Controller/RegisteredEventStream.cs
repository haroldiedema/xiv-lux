/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading;
using Lux.Common;
using Lux.Common.Model;
using Lux.Server.WebSocket;

namespace Lux.Server.Controller;

public sealed class RegisteredEventStream : IDisposable
{
    public readonly string Name;
    public readonly object? Controller;
    public readonly MethodInfo MethodInfo;

    private readonly List<Client> _recipients = [];

    private bool _isDisposed = false;
    private byte[]? _lastValue = null;
    private Timer _timer;

    public RegisteredEventStream(string name, int tickRate, object? controller, MethodInfo methodInfo)
    {
        Name = name;
        Controller = controller;
        MethodInfo = methodInfo;

        _timer = new Timer(OnTick, null, 0, tickRate);
    }

    public void AddRecipient(Client client)
    {
        _recipients.Add(client);
        client.OnDisposed += OnClientDisposed;

        SendLastValueTo(client);
    }

    public void SetTickRate(int tickRate)
    {
        _timer.Change(0, tickRate);
    }

    public void Dispose()
    {
        _timer.Dispose();
        _isDisposed = true;
    }

    private void OnTick(object? _)
    {
        if (_isDisposed) return;

        try
        {
            var result = ModelSerializer.Instance.Serialize(MethodInfo.Invoke(Controller, null));
            if (result == null && _lastValue == null) return;

            var value = CreateStreamPayload(result);
            if (!HasValueChanged(value)) return;

            if (value == _lastValue) return;

            _lastValue = value;
            _recipients.ForEach(SendLastValueTo);
        }
        catch (TargetInvocationException e)
        {
            Logger.Error($"Error processing event stream {Name}: {e.InnerException?.Message ?? e.Message} at {e.InnerException?.StackTrace ?? ""}");
        }
        catch (Exception e)
        {
            Logger.Error($"Error processing event stream {Name}: {e.Message}");
        }
    }

    private void OnClientDisposed(Client client)
    {
        _recipients.Remove(client);
        client.OnDisposed -= OnClientDisposed;
    }

    private void SendLastValueTo(Client client)
    {
        if (_lastValue == null) return;
        client.Send(_lastValue).Wait();
    }

    private byte[] CreateStreamPayload(object? result)
    {
        return JsonSerializer.SerializeToUtf8Bytes(new
        {
            Kind = WebSocketMessageKind.EventStream,
            Name = Name,
            Data = result,
        });
    }

    private bool HasValueChanged(byte[] value)
    {
        if (_lastValue == null) return true;
        if (value.Length != _lastValue.Length) return true;

        for (int i = 0; i < value.Length; i++)
        {
            if (value[i] != _lastValue[i])
                return true;
        }

        return false;
    }
}

using System;

namespace Lux.Common.IPC;

#region Upstream IPC

[Serializable]
public class UpstreamIpcRequest
{
}

[Serializable]
public class SetCursorRequest : UpstreamIpcRequest
{
	public Cursor Cursor;
}

[Serializable]
public class UpstreamEchoIpcResponse : UpstreamIpcRequest
{
    public string Message = null!;
}

#endregion

#region Downstream IPC

[Serializable]
public class DownstreamIpcRequest
{
}

[Serializable]
public class DownstreamEchoIpcRequest : DownstreamIpcRequest
{
    public string Message = null!;
}

[Serializable]
public class ResizeRequest : DownstreamIpcRequest
{
	public int Width;
	public int Height;
}


[Serializable]
public class MouseEventRequest : DownstreamIpcRequest
{
	public MouseButton Double;
	public MouseButton Down;
	public bool Leaving;
	public InputModifier Modifier;
	public MouseButton Up;
	public float WheelX;
	public float WheelY;
	public float X;
	public float Y;
}

[Serializable]
public class DevToolsRequest : DownstreamIpcRequest
{
}

[Serializable]
public class ReloadRequest : DownstreamIpcRequest
{
}

#endregion

#region Frame Transport
[Serializable]
public class TextureHandleRequest : UpstreamIpcRequest
{
	public IntPtr TextureHandle;
}

[Serializable]
public class BitmapBufferRequest : UpstreamIpcRequest
{
	public string BitmapBufferName = null!;
	public string FrameInfoBufferName = null!;
}


[Serializable]
public class FrameTransportResponse
{
}

[Serializable]
public class TextureHandleResponse : FrameTransportResponse
{
	public IntPtr TextureHandle;
}

[Serializable]
public class BitmapBufferResponse : FrameTransportResponse
{
	public string BitmapBufferName = null!;
	public string FrameInfoBufferName = null!;
}
#endregion
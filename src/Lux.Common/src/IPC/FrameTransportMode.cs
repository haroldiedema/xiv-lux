using System;

namespace Lux.Common.IPC;

[Flags]
public enum FrameTransportMode
{
	None = 0,
	SharedTexture = 1 << 0,
	BitmapBuffer = 1 << 1
}

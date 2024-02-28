using System;

namespace Lux.Common.IPC;

[Flags]
public enum InputModifier
{
	None = 0,
	Shift = 1 << 0,
	Control = 1 << 1,
	Alt = 1 << 2
}

[Flags]
public enum MouseButton
{
	None = 0,
	Primary = 1 << 0,
	Secondary = 1 << 1,
	Tertiary = 1 << 2,
	Fourth = 1 << 3,
	Fifth = 1 << 4
}

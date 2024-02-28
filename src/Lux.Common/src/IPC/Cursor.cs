namespace Lux.Common.IPC;

public enum Cursor
{
	Default,
	None,
	ContextMenu,
	Help,
	Pointer,
	Progress,
	Wait,
	Cell,
	Crosshair,
	Text,
	VerticalText,
	Alias,
	Copy,
	Move,
	NoDrop,
	NotAllowed,
	Grab,
	Grabbing,
	AllScroll,
	ColResize,
	RowResize,
	NResize,
	EResize,
	SResize,
	WResize,
	NeResize,
	NwResize,
	SeResize,
	SwResize,
	EwResize,
	NsResize,
	NeswResize,
	NwseResize,
	ZoomIn,
	ZoomOut,

	// Special case value - cursor is on a fully-transparent section of the page, and should not capture
	NoCapture
}
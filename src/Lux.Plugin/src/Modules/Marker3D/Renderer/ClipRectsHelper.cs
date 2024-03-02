using System.Drawing;
using System.Numerics;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using FFXIVClientStructs.FFXIV.Client.UI;
using FFXIVClientStructs.FFXIV.Component.GUI;
using ImGuiNET;

namespace Lux;

[Service]
public class ClipRectsHelper
{
    private List<ClipRect> _clipRects = [];

    private static List<string> _ignoredAddonNames = ["_FocusTargetInfo"];

    public unsafe void Update()
    {
        _clipRects.Clear();

        AtkStage* stage = AtkStage.GetSingleton();
        if (stage == null) { return; }

        RaptureAtkUnitManager* manager = stage->RaptureAtkUnitManager;
        if (manager == null) { return; }

        AtkUnitList* loadedUnitsList = &manager->AtkUnitManager.AllLoadedUnitsList;
        if (loadedUnitsList == null) { return; }

        for (int i = 0; i < loadedUnitsList->Count; i++)
        {
            try
            {
                AtkUnitBase* addon = *(AtkUnitBase**)Unsafe.AsPointer(ref loadedUnitsList->EntriesSpan[i]);
                if (addon == null || !addon->IsVisible || addon->WindowNode == null || addon->Scale == 0)
                {
                    continue;
                }

                string? name = Marshal.PtrToStringAnsi(new IntPtr(addon->Name));
                if (name != null && _ignoredAddonNames.Contains(name))
                {
                    continue;
                }

                float margin = 5 * addon->Scale;
                float bottomMargin = 13 * addon->Scale;

                Vector2 pos = new Vector2(addon->X + margin, addon->Y + margin);
                Vector2 size = new Vector2(
                    addon->WindowNode->AtkResNode.Width * addon->Scale - margin,
                    addon->WindowNode->AtkResNode.Height * addon->Scale - bottomMargin
                );

                // special case for duty finder
                if (name == "ContentsFinder")
                {
                    size.X += size.X + (16 * addon->Scale);
                    size.Y += (30 * addon->Scale);
                }

                // just in case this causes weird issues / crashes (doubt it though...)
                ClipRect clipRect = new ClipRect(pos, pos + size);
                if (clipRect.Max.X < clipRect.Min.X || clipRect.Max.Y < clipRect.Min.Y)
                {
                    continue;
                }

                _clipRects.Add(clipRect);
            }
            catch { }
        }
    }

    private List<ClipRect> ActiveClipRects()
    {
        return _clipRects.ToList(); // Deref.
    }

    public ClipRect? GetClipRectForArea(Vector2 pos, Vector2 size)
    {
        List<ClipRect> rects = ActiveClipRects();

        foreach (ClipRect clipRect in rects)
        {
            ClipRect area = new ClipRect(pos, pos + size);
            if (clipRect.IntersectsWith(area))
            {
                return clipRect;
            }
        }

        return null;
    }

    public static ClipRect[] GetInvertedClipRects(ClipRect clipRect)
    {
        float maxX = ImGui.GetMainViewport().Size.X;
        float maxY = ImGui.GetMainViewport().Size.Y;

        Vector2 aboveMin = new Vector2(0, 0);
        Vector2 aboveMax = new Vector2(maxX, clipRect.Min.Y);
        Vector2 leftMin = new Vector2(0, clipRect.Min.Y);
        Vector2 leftMax = new Vector2(clipRect.Min.X, maxY);

        Vector2 rightMin = new Vector2(clipRect.Max.X, clipRect.Min.Y);
        Vector2 rightMax = new Vector2(maxX, clipRect.Max.Y);
        Vector2 belowMin = new Vector2(clipRect.Min.X, clipRect.Max.Y);
        Vector2 belowMax = new Vector2(maxX, maxY);

        ClipRect[] invertedClipRects = new ClipRect[4];
        invertedClipRects[0] = new ClipRect(aboveMin, aboveMax);
        invertedClipRects[1] = new ClipRect(leftMin, leftMax);
        invertedClipRects[2] = new ClipRect(rightMin, rightMax);
        invertedClipRects[3] = new ClipRect(belowMin, belowMax);

        return invertedClipRects;
    }

    public bool IsPointClipped(Vector2 point)
    {
        List<ClipRect> rects = ActiveClipRects();

        foreach (ClipRect clipRect in rects)
        {
            if (clipRect.Contains(point))
            {
                return true;
            }
        }

        return false;
    }
}

public struct ClipRect
{
    public readonly Vector2 Min;
    public readonly Vector2 Max;

    private readonly Rectangle Rectangle;

    public ClipRect(Vector2 min, Vector2 max)
    {
        Vector2 screenSize = ImGui.GetMainViewport().Size;

        Min = Clamp(min, Vector2.Zero, screenSize);
        Max = Clamp(max, Vector2.Zero, screenSize);

        Vector2 size = Max - Min;

        Rectangle = new Rectangle((int)Min.X, (int)Min.Y, (int)size.X, (int)size.Y);
    }

    public bool Contains(Vector2 point)
    {
        return Rectangle.Contains((int)point.X, (int)point.Y);
    }

    public bool IntersectsWith(ClipRect other)
    {
        return Rectangle.IntersectsWith(other.Rectangle);
    }

    private static Vector2 Clamp(Vector2 vector, Vector2 min, Vector2 max)
    {
        return new Vector2(Math.Max(min.X, Math.Min(max.X, vector.X)), Math.Max(min.Y, Math.Min(max.Y, vector.Y)));
    }
}
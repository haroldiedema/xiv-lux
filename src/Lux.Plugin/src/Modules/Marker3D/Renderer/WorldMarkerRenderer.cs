/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Plugin;
using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Component.GUI;
using ImGuiNET;
using System.Numerics;

namespace Lux;

[Service]
internal sealed class WorldMarkerRenderer : IDisposable
{
    private readonly DalamudPluginInterface Plugin;
    private readonly IClientState ClientState;
    private readonly IGameGui GameGui;
    private readonly ITextureProvider TextureProvider;
    private readonly Raycaster Raycaster;
    private readonly ClipRectsHelper ClipRectsHelper;

    private readonly Dictionary<string, WorldMarker> markers = [];

    public WorldMarkerRenderer(
        DalamudPluginInterface plugin, 
        IClientState clientState, 
        IGameGui gameGui,
        ITextureProvider textureProvider,
        Raycaster raycaster,
        ClipRectsHelper clipRectsHelper
    )
    {
        Plugin = plugin;
        ClientState = clientState;
        GameGui = gameGui;
        TextureProvider = textureProvider;
        Raycaster = raycaster;
        ClipRectsHelper = clipRectsHelper;

        plugin.UiBuilder.Draw += OnDraw;
    }

    public void Dispose()
    {
        Plugin.UiBuilder.Draw -= OnDraw;
    }

    public void AddMarker(WorldMarker marker)
    {
        markers[marker.Id] = marker;
    }

    public void RemoveMarker(WorldMarker marker)
    {
        markers.Remove(marker.Id);
    }

    public bool HasMarkerById(string id)
    {
        return markers.ContainsKey(id);
    }

    public WorldMarker? GetMarkerById(string id)
    {
        return markers.TryGetValue(id, out var marker) ? marker : null;
    }

    public void RemoveMarker(string id)
    {
        markers.Remove(id);
    }

    private void OnDraw()
    {
        if (null == ClientState.LocalPlayer) return;
        if (0 == markers.Count) return;

        ClipRectsHelper.Update();

        foreach (var marker in markers.Values) {
            marker.Tick(GameGui, Raycaster, ClientState.LocalPlayer.Position);
            if (marker.Distance > marker.MaxDistance) continue;

            if (marker.IsOnScreen) {
                Render3DMarker(marker);
            } else {
                RenderDirectionMarker(marker);
            }
        }
    }

    private void Render3DMarker(WorldMarker marker)
    {   
        var pos = marker.ScreenPosition;
        var icon = TextureProvider.GetIcon(marker.IconId);
        var id = $"##marker-{marker.Id}";
        var clipRectCount = 0;
        var opacity = Math.Clamp((marker.Distance - 30) / 30, marker.MinAlpha, 1);

        // If the distance > 250, fade out to 0.6 opacity, if its < 200, fade to 1.0.
        if (marker.Distance > 250) {
            opacity = 0.6f;
        }

        var labelText = marker.Label;
        var distText = $"{marker.Distance:0.0}y";

        var labelSize = labelText.Length > 0 ? ImGui.CalcTextSize(labelText).X : 0;
        var distWidth = ImGui.CalcTextSize(distText).X;

        var widgetWidth = Math.Max(32, Math.Max(labelSize, distWidth)) + 8;
        var widgetHeight = labelText.Length > 0 ? 64 : 48;

        ImGui.SetNextWindowSize(new Vector2(widgetWidth, widgetHeight), ImGuiCond.Always);
        ImGui.SetNextWindowPos(new Vector2(pos.X, pos.Y), ImGuiCond.Always, new Vector2(0.5f, 0.5f));
        ImGui.Begin(id, ImGuiWindowFlags.NoTitleBar | ImGuiWindowFlags.NoResize | ImGuiWindowFlags.NoMove | ImGuiWindowFlags.NoScrollbar | ImGuiWindowFlags.NoInputs | ImGuiWindowFlags.NoMouseInputs | ImGuiWindowFlags.NoFocusOnAppearing | ImGuiWindowFlags.NoBringToFrontOnFocus | ImGuiWindowFlags.NoBackground);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(0, 0));
        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(0, 0));
        ImGui.PushStyleVar(ImGuiStyleVar.Alpha, opacity);

        var clipRect = ClipRectsHelper.GetClipRectForArea(new Vector2(pos.X - (widgetWidth / 2), pos.Y - (widgetHeight / 2)), new Vector2(widgetHeight, widgetHeight));
        if (null != clipRect) {
            var invertedClipRects = ClipRectsHelper.GetInvertedClipRects(clipRect.Value);
            foreach (var r in invertedClipRects) {
                ImGui.PushClipRect(r.Min, r.Max, true);
                clipRectCount++;
            }
        }

        if (null != icon) {
            ImGui.SetCursorPos(new Vector2((widgetWidth / 2) - 16, 0));
            ImGui.Image(icon.ImGuiHandle, new Vector2(32, 32));
        }

        if (marker.Label.Length > 0) {
            var textWidth = ImGui.CalcTextSize(marker.Label).X;
            DrawText(marker.Label, new Vector2((widgetWidth / 2) - (textWidth / 2), 32));
        }

        DrawText(distText, new Vector2((widgetWidth / 2) - (distWidth / 2), marker.Label.Length > 0 ? 48 : 32));

        for (var i = 0; i < clipRectCount; i++) ImGui.PopClipRect();
        ImGui.PopStyleVar(3);
        ImGui.End();
    }

    private void RenderDirectionMarker(WorldMarker marker)
    {
        var playerWorldPos = ClientState.LocalPlayer!.Position;
        GameGui.WorldToScreen(playerWorldPos, out var playerScreenPos);

        var direction = new Vector2(marker.WorldPosition.X, marker.WorldPosition.Z) - new Vector2(playerWorldPos.X, playerWorldPos.Z);
        var angle = MathF.Atan2(direction.Y, direction.X) + CameraAngle;
        var icon = TextureProvider.GetIcon(marker.IconId);
        var id = $"##marker-radar-{marker.Id}";
        var widgetSize = 310;
        var halfSize = widgetSize / 2;
        var opacity = Math.Clamp((marker.Distance - 25) / 25, 0, 1);
        var clipRectCount = 0;

        ImGui.SetNextWindowSize(new Vector2(widgetSize, widgetSize), ImGuiCond.Always);
        ImGui.SetNextWindowPos(playerScreenPos, ImGuiCond.Always, new Vector2(0.5f, 0.5f));
        ImGui.Begin(id, ImGuiWindowFlags.NoTitleBar | ImGuiWindowFlags.NoResize | ImGuiWindowFlags.NoMove | ImGuiWindowFlags.NoScrollbar | ImGuiWindowFlags.NoInputs | ImGuiWindowFlags.NoMouseInputs | ImGuiWindowFlags.NoFocusOnAppearing | ImGuiWindowFlags.NoBringToFrontOnFocus | ImGuiWindowFlags.NoBackground);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(0, 0));
        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(0, 0));
        ImGui.PushStyleVar(ImGuiStyleVar.Alpha, opacity);

        var clipRect = ClipRectsHelper.GetClipRectForArea(playerScreenPos, new Vector2(widgetSize, widgetSize));
        if (null != clipRect) {
            var invertedClipRects = ClipRectsHelper.GetInvertedClipRects(clipRect.Value);
            foreach (var r in invertedClipRects) {
                ImGui.PushClipRect(r.Min, r.Max, true);
                clipRectCount++;
            }
        }

        var iconPos = new Vector2(halfSize - 12, halfSize - 12);
        iconPos.X += 128 * MathF.Cos(angle);
        iconPos.Y += 128 * MathF.Sin(angle);

        if (null != icon) {
            ImGui.SetCursorPos(iconPos);
            ImGui.Image(icon.ImGuiHandle, new Vector2(24, 24));
        }

        // Draw a direction arrow.
        var arrow = TextureProvider.GetIcon(60541);
        if (null != arrow) {
            var arrowPos = new Vector2(halfSize - 16, halfSize - 16);
            // Offset the arrow position by the icon position.
            arrowPos.X += (128 + 16) * MathF.Cos(angle);
            arrowPos.Y += (128 + 16) * MathF.Sin(angle);

            ImGui.SetCursorPos(arrowPos);
            ImageRotated(arrow.ImGuiHandle, new Vector2(32, 32), new Vector2(16, 16), angle, opacity);
        }

        for (var i = 0; i < clipRectCount; i++) ImGui.PopClipRect();
        ImGui.PopStyleVar(3);
        ImGui.End();
    }

    private static void DrawText(string text, Vector2 pos)
    {
        ImGui.PushStyleColor(ImGuiCol.Text, 0xC0000000);
        ImGui.SetCursorPos(pos + new Vector2(-1, -1)); ImGui.TextUnformatted(text);
        ImGui.SetCursorPos(pos + new Vector2(1, 1)); ImGui.TextUnformatted(text);
        ImGui.PopStyleColor();

        ImGui.SetCursorPos(pos);
        ImGui.TextUnformatted(text);
    }

    public static void ImageRotated(IntPtr textureID, Vector2 size, Vector2 center, float rotationAngleRadians, float alpha = 1.0f)
    {
        Vector2 pos = ImGui.GetCursorScreenPos();
        Matrix3x2 mat = Matrix3x2.CreateRotation(rotationAngleRadians, center);

        Vector2[] corners = [
            new Vector2(0, 0),
            new Vector2(size.X, 0),
            new Vector2(size.X, size.Y),
            new Vector2(0, size.Y)
        ];

        center -= size / 2;

        for (byte i = 0; i < 4; i++)
        {
            corners[i] -= center;
            corners[i] = Vector2.Transform(corners[i], mat);
            corners[i] += center;
        }

        uint color = 0x00FFFFFF | (uint) (Math.Clamp((int)Math.Round(alpha * 255), 0, 128) << 24);

        ImGui.GetWindowDrawList().AddImageQuad(
            textureID,
            pos + corners[0], pos + corners[1], pos + corners[2], pos + corners[3],
            Vector2.UnitY, Vector2.Zero, Vector2.UnitX, Vector2.One,
            color
        );
    }

    private static unsafe float CameraAngle => DegreesToRadians(AtkStage.GetSingleton()->GetNumberArrayData()[24]->IntArray[3]);
    private static float DegreesToRadians(float degrees) => MathF.PI / 180.0f * degrees;
}

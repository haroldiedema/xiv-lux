/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Numerics;
using Dalamud.Plugin.Services;
using Lux;

internal class WorldMarker(string id, string label, uint iconId, Vector2 position, Vector3? worldPosition = null, bool hasWorldPosition = false, float maxDistance = float.MaxValue)
{
    public string Id = id;
    public string Label = label;
    public uint IconId = iconId;
    public Vector2 Position = position;
    public Vector3 WorldPosition = worldPosition ?? new();
    public Vector2 ScreenPosition = new();
    public bool IsOnScreen = false;
    public float Distance = 0;
    public float GuessedY = 0f;
    public float MaxDistance = maxDistance;
    public float MinAlpha = 0.0f;
    private readonly bool HasWorldPosition = hasWorldPosition;

    public void Tick(IGameGui gameGui, Raycaster raycaster, Vector3 origin)
    {
        if (false == HasWorldPosition) {
            var y = raycaster.GetTerrainY(Position);
            
            if (y == 0) {
                if (0 == GuessedY) {
                    GuessedY = raycaster.GetEstimatedTerrainY(Position);
                }

                y = GuessedY;
            } else {
                GuessedY = 0;
            }
            
            if (y == 0) {
                // Fallback to player Y.
                y = origin.Y;
            }

            WorldPosition = new Vector3(Position.X, y, Position.Y);
        }

        IsOnScreen = gameGui.WorldToScreen(WorldPosition, out ScreenPosition);
        Distance = Vector3.Distance(origin, WorldPosition);
    }
}

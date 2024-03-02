/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Numerics;
using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Common.Component.BGCollision;

namespace Lux;

[Service]
internal sealed class Raycaster(IClientState clientState)
{
    public float GetTerrainY(Vector2 position)
    {
        if (! CanRaycast) {
            return 0;
        }

        return GetYAt(position) ?? 0;
    }

    public float GetEstimatedTerrainY(Vector2 position)
    {
        if (! CanRaycast) {
            return 0f;
        }

        // Get the direction vector between the position and player.
        var plr = new Vector2(clientState.LocalPlayer!.Position.X, clientState.LocalPlayer!.Position.Z);
        var dir = Vector2.Normalize(plr - position);
        float? y;

        // Find the maximum range the raycaster is allowed to travel.
        for (var i = 500f; i > 0; i -= 1f) {
            var p = plr + (dir * i);
            y = GetYAt(p);

            if (null != y) {
                return y.Value;
            }
        }

        return 0;
    }

    private unsafe float? GetYAt(Vector2 position)
    {
        RaycastHit* hit = stackalloc RaycastHit[1];

        var origin = new Vector3(position.X, MathF.Max(1f, MathF.Min(1000, PlayerY + 1000)), position.Y);
        var flags = stackalloc int[] { 0x4000, 0x4000 };
        var result = BGCollisionModule.Raycast(origin, new Vector3(0, -1.0f, 0), 1000.0f, hit, flags);

        return result ? hit[0].Point.Y : null;
    }

    private bool CanRaycast => clientState.LocalPlayer != null;

    private float PlayerY => clientState.LocalPlayer!.Position.Y;
}
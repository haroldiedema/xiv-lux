/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
*      for rich cartography interfaces.            |    |   |    |   \   \/  /
*                                                  |    |   |    |   /\     /
* Package: Lux.Plugin                              |    |___|    |  / /     \
* Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
* -------------------------------------------------------- \/              \*/

using Dalamud.Plugin.Services;
using FFXIVClientStructs.FFXIV.Client.Game.Control;
using FFXIVClientStructs.FFXIV.Component.GUI;
using Lux.Models;
using Lux.Server.Configuration;

namespace Lux.Controllers;

[Controller]
internal unsafe sealed class CameraController(IClientState clientState)
{
    [WebSocketEventStream("Camera", 30)]
    public object? StreamCameraState()
    {
        CameraManager* cm;
        if (!clientState.IsLoggedIn || (cm = CameraManager.Instance()) == null) return null;

        var camera = cm->Camera->CameraBase.SceneCamera;

        return new Camera { Rotation = GetCameraRotation() + (MathF.PI / 2) };
    }

    private float GetCameraRotation() => -DegreesToRadians(AtkStage.GetSingleton()->GetNumberArrayData()[24]->IntArray[3]) - 0.5f * MathF.PI;

    private float DegreesToRadians(float degrees) => MathF.PI / 180.0f * degrees;
}

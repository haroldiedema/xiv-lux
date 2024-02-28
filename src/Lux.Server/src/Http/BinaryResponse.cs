/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

namespace Lux.Server.Http;

public sealed class BinaryResponse : Response
{
    public BinaryResponse(byte[] bytes, string contentType = "application/octet-stream")
    {
        EnableCache();
        SetBinaryContent(bytes, contentType);
    }
}

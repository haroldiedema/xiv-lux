/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.Plugin                              |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using Dalamud.Plugin.Services;
using Lumina.Data.Files;
using Lumina.Excel.GeneratedSheets;
using Lux.Server.Configuration;
using Lux.Server.Http;

namespace Lux.Controllers;

[Controller]
internal sealed class ImageController(IDataManager dataManager, ITextureProvider textureProvider)
{
    private readonly Dictionary<(uint, bool), byte[]> iconCache = [];

    [Route("/image/icon/{iconId}.png")]
    public BinaryResponse IconAction(uint iconId)
    {
        if (iconCache.TryGetValue((iconId, false), out var data)) return new BinaryResponse(data, "image/png");

        var file = GetTexFile(iconId);
        if (file is null) return new BinaryResponse([0], "image/png");

        var png = TexConverter.ToPng(file);
        iconCache[(iconId, false)] = png;

        return new BinaryResponse(png, "image/png");
    }

    [Route("/image/icon/{iconId}-hr.png")]
    public BinaryResponse IconHiResAction(uint iconId)
    {
        if (iconCache.TryGetValue((iconId, true), out var data)) return new BinaryResponse(data, "image/png");

        var file = GetTexFile(iconId, true);
        if (file is null) return new BinaryResponse([0], "image/png");

        var png = TexConverter.ToPng(file);
        iconCache[(iconId, true)] = png;

        return new BinaryResponse(png, "image/png");
    }

    [Route("/image/map/{mapId}.png")]
    public Response MapTextureAction(uint mapId)
    {
        var map = ExcelSheet<Map>.Find(mapId);
        if (map is null) return new Response().SetStatus(404).DisableCache();

        string rawId = map.Id.RawString;
        string fileName = $"ui/map/{rawId}/{rawId.Replace("/", "")}_m.tex";

        Logger.Debug($"Serving map texture {mapId}, path: {fileName}");
        TexFile? file = dataManager.GetFile<TexFile>(fileName);

        if (file is null) return new Response().SetStatus(404).DisableCache();

        return new BinaryResponse(TexConverter.ToPng(file), "image/png").EnableCache();
    }

    private TexFile? GetTexFile(uint iconId, bool hiRes = false, bool isRetry = false)
    {
        string? path = textureProvider.GetIconPath(iconId);
        if (path is null) return null;

        path = hiRes ? path : path.Replace("_hr1.tex", ".tex");

        var file = dataManager.GetFile<TexFile>(path);
        if (file is null && !isRetry) return GetTexFile(iconId, !hiRes, true);

        return file;
    }
}

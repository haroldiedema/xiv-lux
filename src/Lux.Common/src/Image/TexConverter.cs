/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using Lumina.Data.Files;

namespace Lux.Common;

public static class TexConverter
{
    public static byte[] ToPng(TexFile file)
    {
        using var bitmap = GetBitmapFromTexFile(file);
        using var stream = new MemoryStream();

        bitmap.Save(stream, ImageFormat.Png);
        byte[] data = stream.ToArray();

        return data;
    }

    private static Bitmap GetBitmapFromTexFile(TexFile file)
    {
        var width = file.TextureBuffer.Width;
        var height = file.TextureBuffer.Height;

        Bitmap bitmap = new(width, height, PixelFormat.Format32bppArgb);
        byte[] imageData = file.ImageData;

        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                var i = (y * width + x) * 4;
                bitmap.SetPixel(x, y, Color.FromArgb(imageData[i + 3], imageData[i + 2], imageData[i + 1], imageData[i]));
            }
        }

        return bitmap;
    }
}

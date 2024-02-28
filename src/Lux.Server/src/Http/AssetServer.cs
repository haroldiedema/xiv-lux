/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Server                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Lux.Common;

namespace Lux.Server.Http;

public static class AssetServer
{
    private static DirectoryInfo? AssetsPath = null;
    private static readonly bool IS_DEBUG = true;
    private static string AutoloadSource = "";

    public static void Initialize()
    {
        var location = Assembly.GetExecutingAssembly()?.Location;

        if (null == location) return;
        var dllFile = new FileInfo(location);
        var rootDir = dllFile?.Directory;

        if (null == rootDir)
        {
            throw new DirectoryNotFoundException("Could not find the root directory of the executing assembly.");
        }

        AssetsPath = new DirectoryInfo(Path.Combine(rootDir.FullName, "assets"));
        if (!AssetsPath.Exists)
        {
            AssetsPath.Create();
        }

        Logger.Debug($"Serving assets from: {AssetsPath.FullName}");
        GenerateAutoloadFile();
    }

    public static void Dispose()
    {
    }

    public static Response GetAsset(string path)
    {
        if (IS_DEBUG)
        {
            GenerateAutoloadFile();
        }

        if (path == "/autoload.js")
        {
            return new Response().SetTextContent(AutoloadSource, "application/javascript");
        }

        var file = Resolve(path);
        if (file == null)
        {
            return new Response().SetStatus(404);
        }

        var extension = file.Extension.ToLowerInvariant();

        if (extension == ".html" || extension == ".css" || extension == ".js" || extension == ".json")
        {
            return new Response().SetTextContent(File.ReadAllText(file.FullName), GetMimeTypeOf(file));
        }

        return new BinaryResponse(File.ReadAllBytes(file.FullName), GetMimeTypeOf(file));
    }

    private static FileInfo? Resolve(string fileName)
    {
        if (fileName == "/") return Resolve("/index.html");
        if (fileName.StartsWith("/")) fileName = "." + fileName;
        var file = new FileInfo(Path.Combine(AssetsPath!.FullName, fileName.Replace("/", "\\")));

        if (file.Exists)
        {
            return file;
        }

        // If the file is a directory, try to find an index.js file.
        if (!file.Exists && new DirectoryInfo(file.FullName).Exists)
        {
            file = new FileInfo(Path.Combine(file.FullName, "index.js"));

            if (file.Exists)
            {
                return file;
            }

            return null;
        }

        // Try to append a ".js" extension to the file name.
        file = new FileInfo(file.FullName + ".js");

        return file.Exists ? file : null;
    }

    private static string GetMimeTypeOf(FileInfo file)
    {
        return file.Extension.ToLowerInvariant() switch
        {
            ".html" => "text/html",
            ".css" => "text/css",
            ".js" => "application/javascript",
            ".json" => "application/json",
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            _ => "application/octet-stream",
        };
    }

    private static void GenerateAutoloadFile()
    {
        var decorators = GetAutoloadDecorators();

        var files = AssetsPath!.GetFiles("*.js", SearchOption.AllDirectories);
        var autoloadLines = new List<string>();

        foreach (var file in files.Reverse())
        {
            if (!file.Exists) continue;

            var contents = File.ReadAllText(file.FullName);
            var decorator = decorators.Find(decorator => contents.Contains(" " + decorator + " ") || contents.Contains(" " + decorator + ",") || contents.Contains(decorator + "("));

            if (null != decorator)
            {
                var relativePath = file.FullName.Replace(AssetsPath.FullName, "").Replace("\\", "/").Replace(".js", "");
                var importStatement = $"import '@/{relativePath}';";
                autoloadLines.Add(importStatement);
            }
        }

        AutoloadSource = string.Join("\n", autoloadLines);
    }

    private static List<string> GetAutoloadDecorators()
    {
        var decorators = new List<string>();
        var files = AssetsPath!.GetFiles("*.js", SearchOption.AllDirectories);

        foreach (var file in files)
        {
            // Get the text content of the file.
            var lines = File.ReadAllText(file.FullName).Split("\n");
            var isAutoload = false;
            var decoratorName = "";

            // Find all decorators in the file.
            foreach (var line in lines)
            {
                if (line.StartsWith(" * @autoload"))
                {
                    isAutoload = true;
                }

                if (line.StartsWith("export function "))
                {
                    decoratorName = line.Split(" ")[2];
                    decoratorName = decoratorName.Split("(")[0];
                }
            }

            if (isAutoload && !string.IsNullOrEmpty(decoratorName))
            {
                decorators.Add(decoratorName);
            }
        }

        return decorators;
    }
}
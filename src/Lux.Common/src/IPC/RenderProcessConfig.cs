using System;
using System.Text;
using System.Text.Json;

namespace Lux.Common.IPC;

public sealed class RenderProcessConfig
{
    public string CefAssemblyDir = null!;
    public string AssetDir = null!;
	public string CefCacheDir = null!;
	public string DalamudAssemblyDir = null!;
	public long DxgiAdapterLuid;
	public string IpcChannelName = null!;
	public string KeepAliveHandleName = null!;
	public int ParentPid;
    public int Port;

    public string Serialize()
    {
        var json = System.Text.Json.JsonSerializer.Serialize(this, new JsonSerializerOptions {
            AllowTrailingCommas = false,
            IgnoreReadOnlyFields = false,
            IncludeFields = true,
            WriteIndented = false,
        });

        return Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
    }

    public static RenderProcessConfig Deserialize(string base64Json)
    {
        var json = Encoding.UTF8.GetString(Convert.FromBase64String(base64Json));

        var obj = System.Text.Json.JsonSerializer.Deserialize<RenderProcessConfig>(json, new JsonSerializerOptions {
            AllowTrailingCommas = false,
            IgnoreReadOnlyFields = false,
            IncludeFields = true,
        })!;

        obj.IpcChannelName = obj.IpcChannelName?.ToString() ?? "";
        obj.KeepAliveHandleName = obj.KeepAliveHandleName?.ToString() ?? "";
        obj.CefAssemblyDir = obj.CefAssemblyDir?.ToString() ?? "";
        obj.CefCacheDir = obj.CefCacheDir?.ToString() ?? "";
        obj.DalamudAssemblyDir = obj.DalamudAssemblyDir?.ToString() ?? "";

        return obj;
    }
}
/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Dalamud.Plugin.Services;
using Lumina.Excel;

namespace Lux.Common;

public class ExcelSheet<T> : IEnumerable<T> where T : ExcelRow
{
    private static ExcelSheet<T>? _instance;
    public static ExcelSheet<T> All => _instance ??= new ExcelSheet<T>();

    private readonly Func<uint, T?> searchAction;
    private readonly ConcurrentDictionary<uint,       T> cache = new();
    private readonly ConcurrentDictionary<Tuple<uint, uint>,    T> subRowCache = new();

    public static T? Find(uint rowId)
    {
        return All.FindRow(rowId);
    }

    public static T? Find(uint rowId, uint subRowId)
    {
        return All.FindRow(rowId, subRowId);
    }

    public IEnumerator<T> GetEnumerator()
    {
        return ServiceContainer.Get<IDataManager>().GetExcelSheet<T>()!.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    private ExcelSheet(Func<uint, T?>? action = null)
    {
        searchAction = action ?? (row => ServiceContainer.Get<IDataManager>().GetExcelSheet<T>()!.GetRow(row));
    }

    private T? FindRow(uint id)
    {
        if (cache.TryGetValue(id, out var value)) return value;
        if (searchAction(id) is not { } result) return null;

        return cache[id] = result;
    }

    private T? FindRow(uint row, uint subRow)
    {
        var targetRow = new Tuple<uint, uint>(row, subRow);

        if (subRowCache.TryGetValue(targetRow, out var value)) return value;
        if (ServiceContainer.Get<IDataManager>().GetExcelSheet<T>()!.GetRow(row, subRow) is not { } result) return null;

        return subRowCache[targetRow] = result;
    }
}
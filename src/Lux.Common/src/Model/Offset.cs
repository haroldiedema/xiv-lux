  /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System;

namespace Lux.Common.Model;

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
public sealed class Offset(int offset): Attribute
{
    public int Value { get; } = offset;
}

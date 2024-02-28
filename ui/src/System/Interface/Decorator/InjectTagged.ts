/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export function InjectTagged(...tags: string[])
{
    return function (target: any, propertyKey: string)
    {
        target['__service_refs__'] = target['__service_refs__'] ?? [];
        target['__service_refs__'].push({
            key: propertyKey,
            kind: 'tagged',
            tags: tags,
        });
    };
}

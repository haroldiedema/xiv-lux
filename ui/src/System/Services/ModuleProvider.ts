/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export function getDecoratedModulePath(): string
{
    const stack = new Error().stack.split('\n');

    for (const line of stack) {
        if (line.match(/__decorate\s/)) {
            const match = line.match(/\((.*)\)/);

            if (!match) {
                continue;
            }

            const url = new URL(match[1]);

            return url.pathname.split(':')[0].replace(/^\/+/, '');
        }
    }

    return null;
}

/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
declare module '@/System/Interface/jsx-runtime'
{
    export function jsx(type: string | Function, attributes: { [name: string]: any; }, ...children: any): any;
    export const jsxs: typeof jsx;
}

declare namespace JSX
{
    interface IntrinsicElements
    {
        [key: string]: any;
    }
}
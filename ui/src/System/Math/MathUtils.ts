/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export const MathUtils = {

    interpolate: (a: number, b: number, alpha: number): number =>
    {
        return a + (b - a) * alpha;
    },

    clamp: (value: number, min: number, max: number): number =>
    {
        return Math.min(Math.max(value, min), max);
    },

    convertToRange: (num: number, inMin: number, inMax: number, outMin: number, outMax: number): number =>
    {
        return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
};

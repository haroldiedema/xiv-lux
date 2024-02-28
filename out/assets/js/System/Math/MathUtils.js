/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export const MathUtils = {
    interpolate: (a, b, alpha) => {
        return a + (b - a) * alpha;
    },
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },
    convertToRange: (num, inMin, inMax, outMin, outMax) => {
        return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
};
//# sourceMappingURL=MathUtils.js.map
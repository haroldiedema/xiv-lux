/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export const ConfigVariables = {
    'toolbar.autoHide': cvar({ type: Boolean, default: false }),
    'toolbar.position': cvar({ type: String, default: 'bottom' }),
    'wm.openWindows': cvar({ default: [] }),
    'location.favorites': cvar({ default: [] }),
    // WorldMap configuration
    'worldMap.backgroundOpacity': cvar({ type: Number, default: 0.5, min: 0, max: 1, step: 0.01, label: "Map texture opacity" }),
    'worldMap.backgroundSaturation': cvar({ type: Number, default: 0.5, min: 0, max: 1, step: 0.01, label: "Map texture saturation" }),
    'worldMap.showGridLines': cvar({ type: Boolean, default: true, label: "Show grid lines" }),
    'worldMap.gridSize': cvar({ type: Number, default: 32, min: 8, max: 512, step: 8, label: "Grid size" }),
    'worldMap.zoomFactor': cvar({ type: Number, default: 1 }),
};
function cvar(options) {
    return {
        type: options.type,
        default: options.default ?? false,
        label: options.label ?? null,
        desc: options.desc ?? null,
        min: options.min,
        max: options.max,
        step: options.step,
    };
}
//# sourceMappingURL=ConfigVariables.js.map
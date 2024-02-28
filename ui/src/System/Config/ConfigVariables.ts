/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export const ConfigVariables = {
    'toolbar.autoHide': cvar({ type: Boolean, default: false }),
    'toolbar.position': cvar({ type: String, default: 'bottom' }),
    'wm.openWindows': cvar<string[]>({ default: [] }),
    'location.favorites': cvar<string[]>({ default: [] }),

    // WorldMap configuration
    'worldMap.backgroundOpacity': cvar({ type: Number, default: 0.5, min: 0, max: 1, step: 0.01, label: "Map texture opacity" }),
    'worldMap.backgroundSaturation': cvar({ type: Number, default: 0.5, min: 0, max: 1, step: 0.01, label: "Map texture saturation" }),
    'worldMap.showGridLines': cvar({ type: Boolean, default: true, label: "Show grid lines" }),
    'worldMap.gridSize': cvar({ type: Number, default: 32, min: 8, max: 512, step: 8, label: "Grid size" }),
    'worldMap.zoomFactor': cvar({ type: Number, default: 1 }),
} as const;

type ConfigVariable<T> = {
    type?: T;
    default: any;
    label?: string;
    desc?: string;
    min?: number;
    max?: number;
    step?: number;
};

function cvar<T>(options: ConfigVariable<T>)
{
    return {
        type: options.type,
        default: options.default ?? false,
        label: options.label ?? null,
        desc: options.desc ?? null,
        min: options.min,
        max: options.max,
        step: options.step,
    } as const;
}

type Constructor = (...args: any[]) => any;

export type ConfigVariables = typeof ConfigVariables;
export type ConfigVariableName = keyof ConfigVariables;
export type ConfigVariableType<K extends ConfigVariableName> = ConfigVariables[K]['type'] extends Constructor
    ? ReturnType<ConfigVariables[K]['type']>
    : ConfigVariables[K]['type'];

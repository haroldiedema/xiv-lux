/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export type UpstreamCommands = {
    "Aetheryte.Teleport": {
        "input": [number, number],
        "output": boolean;
    };
    'MapMarkers.SetFlag': {
        'input': [number, number, boolean],
        'output': boolean;
    };
    'MapMarkers.RemoveFlag': {
        'input': [],
        'output': boolean;
    };
};

export type UpstreamCommandName = keyof UpstreamCommands;
export type UpstreamCommandArgs<K extends UpstreamCommandName> = UpstreamCommands[K]['input'];
export type UpstreamCommandResult<K extends UpstreamCommandName> = UpstreamCommands[K]['output'];

export type UpstreamPayload<T extends UpstreamCommandName> = {
    Id: number;
    Command: T;
    Arguments: UpstreamCommandArgs<T>;
};

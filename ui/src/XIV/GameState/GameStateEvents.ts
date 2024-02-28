/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export type GameStateEvents = {
    'login': void;
    'logout': void;

    'occupied': void;
    'idle': void;

    'combat-start': void;
    'combat-end': void;

    'cutscene-start': void;
    'cutscene-end': void;

    'zone-changed': number;
    'player-changed': string;
};

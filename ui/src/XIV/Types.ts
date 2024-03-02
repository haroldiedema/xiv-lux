/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export enum Role
{
    Tank = 'tank',
    Healer = 'healer',
    MeleeDPS = 'melee-dps',
    RangedDPS = 'ranged-dps',
    CasterDPS = 'caster-dps',
    Crafter = 'crafter',
    Gatherer = 'gatherer',
}

export enum Job
{
    'NONE',
    'GLA',
    'PGL',
    'MRD',
    'LNC',
    'ARC',
    'CNJ',
    'THM',
    'CRP',
    'BSM',
    'ARM',
    'GSM',
    'LTW',
    'WVR',
    'ALC',
    'CUL',
    'MIN',
    'BTN',
    'FSH',
    'PLD',
    'MNK',
    'WAR',
    'DRG',
    'BRD',
    'WHM',
    'BLM',
    'ACN',
    'SMN',
    'SCH',
    'ROG',
    'NIN',
    'MCH',
    'DRK',
    'AST',
    'SAM',
    'RDM',
    'BLU',
    'GNB',
    'DNC',
    'RPR',
    'SGE',
}

export const RoleMap: { [job in keyof typeof Job]?: Role } = {
    'GLA': Role.Tank,
    'PGL': Role.MeleeDPS,
    'MRD': Role.MeleeDPS,
    'LNC': Role.MeleeDPS,
    'ARC': Role.RangedDPS,
    'CNJ': Role.Healer,
    'THM': Role.CasterDPS,
    'CRP': Role.Crafter,
    'BSM': Role.Crafter,
    'ARM': Role.Crafter,
    'GSM': Role.Crafter,
    'LTW': Role.Crafter,
    'WVR': Role.Crafter,
    'ALC': Role.Crafter,
    'CUL': Role.Crafter,
    'MIN': Role.Gatherer,
    'BTN': Role.Gatherer,
    'FSH': Role.Gatherer,
    'PLD': Role.Tank,
    'MNK': Role.MeleeDPS,
    'WAR': Role.Tank,
    'DRG': Role.MeleeDPS,
    'BRD': Role.RangedDPS,
    'WHM': Role.Healer,
    'BLM': Role.CasterDPS,
    'ACN': Role.CasterDPS,
    'SMN': Role.CasterDPS,
    'SCH': Role.Healer,
    'ROG': Role.MeleeDPS,
    'NIN': Role.MeleeDPS,
    'MCH': Role.RangedDPS,
    'DRK': Role.Tank,
    'AST': Role.Healer,
    'SAM': Role.MeleeDPS,
    'RDM': Role.CasterDPS,
    'BLU': Role.CasterDPS,
    'GNB': Role.Tank,
    'DNC': Role.RangedDPS,
    'RPR': Role.MeleeDPS,
    'SGE': Role.Healer,
};

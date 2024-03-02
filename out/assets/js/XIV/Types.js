/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export var Role;
(function (Role) {
    Role["Tank"] = "tank";
    Role["Healer"] = "healer";
    Role["MeleeDPS"] = "melee-dps";
    Role["RangedDPS"] = "ranged-dps";
    Role["CasterDPS"] = "caster-dps";
    Role["Crafter"] = "crafter";
    Role["Gatherer"] = "gatherer";
})(Role || (Role = {}));
export var Job;
(function (Job) {
    Job[Job["NONE"] = 0] = "NONE";
    Job[Job["GLA"] = 1] = "GLA";
    Job[Job["PGL"] = 2] = "PGL";
    Job[Job["MRD"] = 3] = "MRD";
    Job[Job["LNC"] = 4] = "LNC";
    Job[Job["ARC"] = 5] = "ARC";
    Job[Job["CNJ"] = 6] = "CNJ";
    Job[Job["THM"] = 7] = "THM";
    Job[Job["CRP"] = 8] = "CRP";
    Job[Job["BSM"] = 9] = "BSM";
    Job[Job["ARM"] = 10] = "ARM";
    Job[Job["GSM"] = 11] = "GSM";
    Job[Job["LTW"] = 12] = "LTW";
    Job[Job["WVR"] = 13] = "WVR";
    Job[Job["ALC"] = 14] = "ALC";
    Job[Job["CUL"] = 15] = "CUL";
    Job[Job["MIN"] = 16] = "MIN";
    Job[Job["BTN"] = 17] = "BTN";
    Job[Job["FSH"] = 18] = "FSH";
    Job[Job["PLD"] = 19] = "PLD";
    Job[Job["MNK"] = 20] = "MNK";
    Job[Job["WAR"] = 21] = "WAR";
    Job[Job["DRG"] = 22] = "DRG";
    Job[Job["BRD"] = 23] = "BRD";
    Job[Job["WHM"] = 24] = "WHM";
    Job[Job["BLM"] = 25] = "BLM";
    Job[Job["ACN"] = 26] = "ACN";
    Job[Job["SMN"] = 27] = "SMN";
    Job[Job["SCH"] = 28] = "SCH";
    Job[Job["ROG"] = 29] = "ROG";
    Job[Job["NIN"] = 30] = "NIN";
    Job[Job["MCH"] = 31] = "MCH";
    Job[Job["DRK"] = 32] = "DRK";
    Job[Job["AST"] = 33] = "AST";
    Job[Job["SAM"] = 34] = "SAM";
    Job[Job["RDM"] = 35] = "RDM";
    Job[Job["BLU"] = 36] = "BLU";
    Job[Job["GNB"] = 37] = "GNB";
    Job[Job["DNC"] = 38] = "DNC";
    Job[Job["RPR"] = 39] = "RPR";
    Job[Job["SGE"] = 40] = "SGE";
})(Job || (Job = {}));
export const RoleMap = {
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
//# sourceMappingURL=Types.js.map
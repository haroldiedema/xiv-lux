/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Service } from "@/System/Services";
let NameSanitizer = class NameSanitizer {
    constructor() {
        this.worldNames = [
            // NA:
            // Aether
            'Adamantoise',
            'Cactuar',
            'Faerie',
            'Gilgamesh',
            'Jenova',
            'Midgardsormr',
            'Sargatanas',
            'Siren',
            // Crystal
            'Balmung',
            'Brynhildr',
            'Coeurl',
            'Diabolos',
            'Goblin',
            'Malboro',
            'Mateus',
            'Zalera',
            // Dynamis
            'Halicarnassus',
            'Maduin',
            'Marilith',
            'Seraph',
            // Primal
            'Behemoth',
            'Excalibur',
            'Exodus',
            'Famfrit',
            'Hyperion',
            'Lamia',
            'Leviathan',
            'Ultros',
            // EU:
            // Light
            'Alpha',
            'Lich',
            'Odin',
            'Phoenix',
            'Raiden',
            'Shiva',
            'Twintania',
            'Zodiark',
            // Chaos
            'Cerberus',
            'Louisoix',
            'Moogle',
            'Omega',
            'Phantom',
            'Ragnarok',
            'Sagittarius',
            'Spriggan',
            // Japan:
            // Elemental
            'Aegis',
            'Atomos',
            'Carbuncle',
            'Garuda',
            'Gungnir',
            'Kujata',
            'Ramuh',
            'Tonberry',
            'Typhon',
            // Gaia
            'Alexander',
            'Bahamut',
            'Durandal',
            'Fenrir',
            'Ifrit',
            'Ridill',
            'Tiamat',
            'Ultima',
            // Mana
            'Anima',
            'Asura',
            'Chocobo',
            'Hades',
            'Ixion',
            'Masamune',
            'Pandaemonium',
            'Titan',
            // Meteor
            'Belias',
            'Mandragora',
            'Ramuh',
            'Shinryu',
            'Unicorn',
            'Valefor',
            'Yojimbo',
            'Zeromus',
        ];
    }
    sanitize(name) {
        name = name.trim();
        if (name.toLowerCase().startsWith('the ')) {
            name = name.substring(4).trim();
        }
        if (!name.includes(' ')) {
            return name;
        }
        const parts = name.split(' ');
        const firstName = parts.shift();
        let lastName = parts.join(' ');
        for (let worldName of this.worldNames) {
            if (lastName.endsWith(worldName) && lastName.length > worldName.length) {
                lastName = lastName.substr(0, lastName.length - worldName.length).trim();
            }
        }
        return `${firstName} ${lastName}`;
    }
};
NameSanitizer = __decorate([
    Service()
], NameSanitizer);
export { NameSanitizer };
//# sourceMappingURL=NameSanitizer.js.map
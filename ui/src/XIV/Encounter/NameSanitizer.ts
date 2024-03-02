/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { Service } from "@/System/Services";

@Service()
export class NameSanitizer
{
    private readonly worldNames: string[] = [
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

    public sanitize(name: string): string
    {
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
}
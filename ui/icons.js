const fs = require('fs');

const icons = JSON.parse(fs.readFileSync('icons.json', 'utf8'));
const result = [];

Object.keys(icons).forEach((name) =>
{
    const icon = icons[name];

    let svg = icon.svg.duotone ?? icon.svg.regular ?? icon.svg.solid;
    if (!svg) {
        return;
    }

    let box = svg.viewBox;

    let path = Array.isArray(svg.path) ? svg.path : [svg.path];

    result.push({
        name: name,
        terms: icon.search.terms ?? [],
        box: box,
        types: {
            light: getPath(icon, 'light'),
            regular: getPath(icon, 'regular'),
            solid: getPath(icon, 'solid'),
            duotone: getPath(icon, 'duotone'),
        }
    });
});

fs.writeFileSync('iconlib.json', JSON.stringify(result));

function getPath(icon, type) {
    if (typeof icon.svg[type] === 'undefined') {
        let path = icon.svg[Object.keys(icon.svg)[0]].path;
        return Array.isArray(path) ? path : [path];
    }

    let svg = icon.svg[type];
    return Array.isArray(svg.path) ? svg.path : [svg.path];
}

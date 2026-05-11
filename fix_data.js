const fs = require('fs');

const rawData = fs.readFileSync('catalog_data_v2.json', 'utf8');
let data = JSON.parse(rawData);

// Fix common encoding issues in titles
const fixTitle = (str) => {
    return str
        .replace(/RelÃ³gio/g, 'Relógio')
        .replace(/ClÃ¡ssico/g, 'Clássico')
        .replace(/EdiÃ§Ã£o/g, 'Edição')
        .replace(/AutomÃ¡tico/g, 'Automático')
        .replace(/rosÃ©/g, 'rosé')
        .replace(/Ã¡gua/g, 'água');
};

data = data.map(p => ({
    ...p,
    title: fixTitle(p.title),
    variants: Array.isArray(p.variants) ? p.variants.map(v => ({ ...v, title: fixTitle(v.title) })) : [p.variants]
}));

fs.writeFileSync('data.js', 'const catalogData = ' + JSON.stringify(data, null, 2) + ';', 'utf8');
console.log('Fixed data.js created.');

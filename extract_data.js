const fs = require('fs');

const rawData = fs.readFileSync('products.json');
const data = JSON.parse(rawData);

const products = data.products.map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: p.body_html.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...',
    price: p.variants[0].price,
    compare_at_price: p.variants[0].compare_at_price,
    image: p.images[0]?.src,
    url: `https://lojanibosi.com.br/products/${p.handle}`
}));

fs.writeFileSync('catalog_data.js', 'const catalogData = ' + JSON.stringify(products, null, 2) + ';');
console.log(`Extracted ${products.length} products.`);

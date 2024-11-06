const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const scrapeVegetablePrices = async () => {
    const url = 'https://vegetablemarketprice.com/market/maharashtra/today';

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const headers = [];
        $('table th').each((i, elem) => {
            headers.push($(elem).text().trim());
        });

        const rows = [];
        $('table tr').slice(1).each((i, elem) => {
            const cells = [];
            $(elem).find('td').each((j, cell) => {
                cells.push($(cell).text().trim());
            });
            while (cells.length < headers.length) cells.push('');
            rows.push(cells);
        });

        const htmlContent = `
        <html>
        <head>
            <title>Vegetable Market Prices</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 8px 12px; border: 1px solid #ccc; text-align: left; }
                th { background-color: #f4f4f4; }
            </style>
        </head>
        <body>
            <h1>Vegetable Market Prices in Maharashtra</h1>
            <table>
                <thead>
                    <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </body>
        </html>`;

        const outputPath = path.join(__dirname, '../public/scraped_vegetable_prices.html');
        fs.writeFileSync(outputPath, htmlContent, 'utf8');
        console.log("HTML file 'scraped_vegetable_prices.html' created successfully.");

        return true;
    } catch (error) {
        console.error("Error scraping data:", error.message);
        return false;
    }
};

// Make sure to export the function
module.exports = scrapeVegetablePrices;

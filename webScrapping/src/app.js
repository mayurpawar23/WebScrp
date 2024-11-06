const express = require('express');
const path = require('path');
const scrapeVegetablePrices = require('./scrape'); // Ensure this path and function name are correct

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/scrape', async (req, res) => {
    const success = await scrapeVegetablePrices();
    if (success) {
        res.sendFile(path.join(__dirname, '../public/scraped_vegetable_prices.html'));
    } else {
        res.status(500).send("Failed to scrape data.");
    }
});

app.get('/', (req, res) => {
    res.send(`
    <html>
        <body>
            <h1>Welcome to Vegetable Market Price Scraper</h1>
            <p>Click <a href="/scrape">here</a> to scrape the latest vegetable prices.</p>
        </body>
    </html>`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

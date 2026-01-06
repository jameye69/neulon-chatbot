const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Chatbot-palvelin on pystyssä!'));

// Tilaushaku-reitti
app.get('/tilaus', async (req, res) => {
    const { numero, email } = req.query;
    try {
        const response = await axios.get(`https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json?name=${numero}`, {
            headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_API_SECRET }
        });
        const tilaus = response.data.orders.find(o => o.email.toLowerCase() === email.toLowerCase());
        if (tilaus) {
            res.json({ viesti: `Tilauksesi tila: ${tilaus.fulfillment_status || 'Käsittelyssä'}.` });
        } else {
            res.json({ viesti: "Tilausta ei löytynyt." });
        }
    } catch (e) {
        res.status(500).json({ viesti: "Virhe yhteydessä." });
    }
});

app.listen(process.env.PORT || 10000);

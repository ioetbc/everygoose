const express = require('express');
const bodyParser = require('body-parser');
const stripeLoader = require('stripe');
const app = express();
const port = process.env.REACT_APP_PORT;
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.listen(port, () => console.log(`Listening on port ${port}`));

const stripe = new stripeLoader(process.env.REACT_APP_STRIPE_SECRET);

const charge = (token, amount) => {
    return stripe.charges.create({
        amount: amount * 100,
        currency: 'GBP',
        source: token,
        description: 'card the customer bought',
    })
}

app.post('/api/hello', async (req, res, next) => {
    try {
        await charge(req.body.token.id, req.body.amount);
        res.send('charged!')
    } catch(error) {
        res.status(500)
    }
    next();
});

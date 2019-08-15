const express = require('express');
const bodyParser = require('body-parser');
const stripeLoader = require('stripe');
const app = express();
const port = process.env.REACT_APP_PORT;
const cors = require("cors");
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

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
        console.log('wt')
        await charge(req.body.token.id, req.body.amount);
        res.send('charged!')
    } catch (error) {
        res.status(500) // TODO change this to log the error
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        auth: {
          user: process.env.REACT_APP_EMAIL_AUTH_USERNAME,
          pass: process.env.REACT_APP_EMAIL_AUTH_PASSWORD
        },
        tls: { rejectUnauthorized: false } // TODO delete this when youre done testing.
    });

    transporter.use('compile', hbs({
        viewEngine: {
            partialsDir : 'express-handlebars',
        },
        path: './client/src/emails/'

    }))

    const options = {
        from: '"customer" <hello@everygoose.com>',
        to: "ioetbc@gmail.com",
        subject: "Hello pug✔",
        template: 'index'
    }

    console.log('req.body', req.body.items);     

    try {   
        await transporter.sendMail(options, (error, info) => {
            if (error) {
                console.log('error', error)
            } else {
                console.log('info', info)
            }
        });
    } catch (error) {
        console.log('about to send customer', error);
        res.status(500) // TODO change this to log the error
    }

    next();
});


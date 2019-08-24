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

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.REACT_APP_EMAIL_AUTH_USERNAME,
      pass: process.env.REACT_APP_EMAIL_AUTH_PASSWORD
    },
});

app.post('/api/hello', async (req, res, next) => {
    try {
        await stripe.charges.create({
            amount: req.body.amount * 100,
            currency: 'GBP',
            source: req.body.token.id,
            description: 'card the customer bought',
        })
    } catch (error) {
        console.log('charge error', error);
    }

    transporter.use('compile', hbs({
        viewEngine: {
            extName: '.handlebars',
            partialsDir: './client/src/emails/',
            layoutsDir: './client/src/emails/',
          },
          viewPath: './client/src/emails/',
          extName: '.handlebars',
    }));

    const everygooseEmail = {
        from: '"everygoose" <hello@everygoose.com>',
        to: "ioetbc@gmail.com",
        subject: "New order",
        template: 'main',
    }

    const { firstName, amount, quantity, token, estimatedDelivery } = req.body;

    const customerEmail = {
        from: '"customer" <hello@everygoose.com>',
        to: "ioetbc@gmail.com",
        subject: "Order confirmation",
        template: 'main',
        context: {
            firstName: firstName,
            amount,
            quantity,
            last4: token.card.last4,
            estimatedDelivery,
        }
    }

    try {
        transporter.sendMail(everygooseEmail, (error) => {
            if (error) {
                return console.log('Error occurs', error);
            }
            return console.log('Email sent!!!');
        });
    } catch (error) {
        console.log('error', error);
    }

    try {
        transporter.sendMail(customerEmail, (error) => {
            if (error) {
                return console.log('Error occurs', error);
            }
            return console.log('Email sent!!!');
        });
    } catch (error) {
        console.log('error', error);
    }

    next();
});

app.post('/api/contact', async (req, res, next) => {
    try {
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.handlebars',
                partialsDir: './client/src/emails/',
                layoutsDir: './client/src/emails/',
              },
              viewPath: './client/src/emails/',
              extName: '.handlebars',
        }));

        const everygooseEmail = {
            from: '"everygoose" <hello@everygoose.com>',
            to: "ioetbc@gmail.com",
            subject: "New order",
            template: 'main',
        }

        transporter.sendMail(everygooseEmail, (error) => {
            if (error) {
                return console.log('Error occurs', error);
            }
            return console.log('Email sent!!!');
        });


    } catch (error) {
       console.log('error', error)
    }
});


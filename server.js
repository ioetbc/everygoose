const express = require('express');
const bodyParser = require('body-parser');
const stripeLoader = require('stripe');
const app = express();
const port = process.env.REACT_APP_PORT;
const cors = require("cors");
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const Joi = require('@hapi/joi');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.listen(port, () => console.log(`Listening on port ${port}`));

const stripe = new stripeLoader(process.env.REACT_APP_STRIPE_SECRET);

const PaySchema = Joi.object({
    firstName: Joi.string().required().min(2).max(25),
    lastName: Joi.string().required().min(2).max(25),
    addressFirstLine: Joi.string().required().min(4).max(50),
    county: Joi.string().required().min(3).max(25),
    postcode: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
})

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.REACT_APP_EMAIL_AUTH_USERNAME,
      pass: process.env.REACT_APP_EMAIL_AUTH_PASSWORD
    },
});

app.post('/api/hello', async (req, res) => {
    const total = (req.body.basket.reduce((a, item) =>  item.price * item.quantity + a, 0) + 2).toFixed(2);
    const { error } = PaySchema.validate(req.body.paymentValues);

    if (error) {
        console.log('validation error', error);
        return error;
    }

    try {
        console.log('validation successful');
        await stripe.charges.create({
            amount: total * 100,
            currency: 'GBP',
            source: req.body.token.id,
            description: 'card the customer bought',
        });
    } catch (error) {
        console.log('stripe error', error);
        return error;
    }

    try {
        console.log('payent successful');
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.handlebars',
                partialsDir: './client/src/emails/',
                layoutsDir: './client/src/emails/',
              },
              viewPath: './client/src/emails/',
              extName: '.handlebars',
        }));

        const { firstName, quantity, token, estimatedDelivery, cardOrCards, theyOrIt } = req.body;

        const customerConfirmation = {
            from: '"Every Goose" <hello@everygoose.com>',
            to: "ioetbc@gmail.com",
            subject: "Order confirmation",
            template: 'main',
            context: {
                firstName,
                amount: total,
                quantity,
                last4: token.card.last4,
                estimatedDelivery,
                cardOrCards,
                theyOrIt
            }
        }

        transporter.sendMail(customerConfirmation, (error) => {
            if (error) {
                console.log('error', error)
                return error;
            }
            return console.log('customer confirmation email sent');
        });

    } catch (error) {
        console.log('error sending customer email', error);
        return error;
    }
});

// app.post('/api/contact', async (req, res, next) => {
//     try {
//         transporter.use('compile', hbs({
//             viewEngine: {
//                 extName: '.handlebars',
//                 partialsDir: './client/src/emails/',
//                 layoutsDir: './client/src/emails/',
//               },
//               viewPath: './client/src/emails/',
//               extName: '.handlebars',
//         }));

//         const everygooseEmail = {
//             from: '"everygoose" <hello@everygoose.com>',
//             to: "ioetbc@gmail.com",
//             subject: "New order",
//             template: 'main',
//         }

//         transporter.sendMail(everygooseEmail, (error) => {
//             if (error) {
//                 return console.log('Error occurs', error);
//             }
//             return console.log('Email sent!!!');
//         });


//     } catch (error) {
//        console.log('error', error)
//     }
// });


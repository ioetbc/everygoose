const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripeLoader = require('stripe');
const cors = require('cors')({ origin: true });
const uuid = require('uuidv4').default;
const sendgrid = require('@sendgrid/mail');
const Joi = require('@hapi/joi')

admin.initializeApp({
    apiKey: functions.config().db.api_key,
    authDomain: functions.config().db.auth_domain,
    databaseURL: functions.config().db.url,
    projectId: functions.config().db.project_id,
    messagingSenderId: functions.config().db.message_sender_id,
    appId: functions.config().db.app_id,
    storageBucket: functions.config().db.storage_bucket,
});

const db = admin.firestore();

const stripe = new stripeLoader(functions.config().stripe.secret_key);
const sendgridSecret = functions.config().sendgrid.secret_key;
sendgrid.setApiKey(sendgridSecret);

const formSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    //eslint-disable-next-line
    email: Joi.string().required().pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
    addressFirst: Joi.string().required().min(2).max(50),
    addressSecond: Joi.string().max(50).allow('').optional(),
    addressThird: Joi.string().max(50).allow('').optional(),
    city: Joi.string().required().min(2).max(50),
    county: Joi.string().required().min(2).max(50),
    //eslint-disable-next-line
    postcode: Joi.string().required().pattern(/^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i),
    //eslint-disable-next-line
    phoneNumber: Joi.string().required().pattern(/^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/i),
});

exports.payment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {

        const validationError = formSchema.validate({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            addressFirst: req.body.addressFirst,
            addressSecond: req.body.addressSecond,
            addressThird: req.body.addressThird,
            city: req.body.city,
            county: req.body.county,
            postcode: req.body.postcode,
            phoneNumber: req.body.phoneNumber,
        }).error

        try {
            if (validationError) throw new Error(`form validation error: ${validationError}`);

            const customer_id = uuid();
            const deliveryCost = 2;
            const total = req.body.basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
            const subtotal = (req.body.basket.reduce((a, item) =>  item.price * item.quantity + a, 0) + deliveryCost).toFixed(2);
            const quantity = req.body.basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0);
            const timeStamp = Date(Date.now()); 
            const formatTimeStamp = timeStamp.toString();
            const items = req.body.basket.map(a => a.title);
            let last4 = 'XXXX';
            const order = req.body.order.map(u => `${u.quantity} x ${u.title}`)

            const payload = {
                customer: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    customerId: customer_id,
                    timeStamp: formatTimeStamp,    
                    items: items,
                    addressFirstLine: req.body.addressFirst,
                    addressSecondLine: req.body.addressSecond || false,
                    addressThirdLine: req.body.addressThird || false,
                    city: req.body.city,
                    county: req.body.county,
                    postcode: req.body.postcode,
                    isPaid: false,
                    total_cost: subtotal,
                }
            }

            const customerRef = db.collection('customers').doc(customer_id);

            console.log('creating customer')
            await customerRef.set(payload)
            .catch((error) => {
                throw new Error(`database error. customer_id: ${customer_id} `, error)

            })

            console.log('attempting to take payment');
            await stripe.charges.create({
                amount: subtotal * 100,
                currency: 'GBP',
                source: req.body.stripeToken,
                description: 'card the customer bought',
            }, { idempotency_key: req.body.idempotencyKey })
            .then((data) => {
                return last4 = data.payment_method_details.card.last4;
            })
            .catch((error) => {
                throw new Error('payment error. customer id: ', customer_id, error);
            })

            console.log('updating customer isPaid to true')
            await customerRef.update({
                'customer.isPaid': true,
            })
            .catch((error) => {
                throw new Error(`is paid to true error. customer_id: ${customer_id} `, error);
            })

            const customerEmail = {
                to: req.body.email,
                from: {
                    email: 'hello@everygoose.com',
                    name: 'Every Goose order confirmation',
                },
                templateId: 'd-28bdd238699d43a09f4520acb84cfa7c',
                dynamic_template_data: {
                    firstName: req.body.firstName,
                    amount: subtotal,
                    last4: last4,
                    estimatedDelivery: req.body.estimatedDelivery,
                    quantity: quantity,
                    cardOrCards: req.body.cardOrCards,
                    theyOrIt: req.body.theyOrIt,
                }
            }

            const imogenEmail = {
                to: 'ioetbc@gmail.com',
                from: {
                    email: 'hello@everygoose.com',
                    name: 'imogen email',
                },
                templateId: 'd-31290132706a4eaaa0fa6c85b34a8ec3',
                dynamic_template_data: {
                    total: total,
                    subtotal: subtotal,
                    estimatedDelivery: req.body.estimatedDelivery,
                    quantity: quantity,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    addressFirstLine: req.body.addressFirst,
                    addressSecondLine: req.body.addressSecond,
                    addressThirdLine: req.body.addressThird,
                    city: req.body.city,
                    county: req.body.county,
                    postcode: req.body.postcode,
                    deliveryCost: deliveryCost,
                    phone: req.body.phoneNumber,
                    cardTitle: order,
                }
            }

            console.log('sending customer email');
            await sendgrid.send(customerEmail)

            console.log('sending imogen email');
            await sendgrid.send(imogenEmail)

            .catch((error) => {
                throw new Error(`email error. customer_id: ${customer_id} `, error);
            })
            res.send('/done');
            
        } catch (error) {
            console.log('an error occured', error)
            res.send('/sorry');
        }
    });
});
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

const contactSchema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    //eslint-disable-next-line
    email: Joi.string().required().pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
    //eslint-disable-next-line
    phone: Joi.string().required().pattern(/^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/i),
    message: Joi.string().required().min(2).max(500),
});

exports.payment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {

        const {
            firstName,
            lastName,
            email,
            addressFirst,
            addressSecond,
            addressThird,
            city,
            county,
            postcode,
            basket,
            breakdown,
            stripeToken,
            idempotencyKey,
            estimatedDelivery,
            cardOrCards,
            theyOrIt,
            phoneNumber,
        } = req.body;

        const validationError = formSchema.validate({
            firstName,
            lastName,
            email,
            addressFirst,
            addressSecond,
            addressThird,
            city,
            county,
            postcode,
            phoneNumber,
        }).error

        try {
            if (validationError) throw new Error(`form validation error: ${validationError}`);
            const customer_id = uuid();
            const total = basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
            const deliveryCharge = total > 35 ? 0 : 2;
            const subtotal = (basket.reduce((a, item) =>  item.price * item.quantity + a, 0) + deliveryCharge).toFixed(2);
            const quantity = basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0);
            const timeStamp = Date(Date.now()); 
            const formatTimeStamp = timeStamp.toString();
            const items = basket.map(a => a.title);
            let last4 = 'XXXX';
            const breakdownMapped = breakdown.map(u => `${u.quantity} x ${u.title}`)

            const payload = {
                customer: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    customerId: customer_id,
                    timeStamp: formatTimeStamp,    
                    items,
                    addressFirstLine: addressFirst,
                    addressSecondLine: addressSecond || false,
                    addressThirdLine: addressThird || false,
                    city,
                    county,
                    postcode,
                    isPaid: false,
                    totalCost: subtotal,
                    deliveryCharge,
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
                source: stripeToken,
                description: 'Card',
            }, { idempotency_key: idempotencyKey })
            .then((data) => {
                return last4 = data.payment_method_details.card.last4;
            })
            .catch((error) => {
                throw new Error('payment error.', error);
            })

            console.log('updating customer isPaid to true')
            await customerRef.update({
                'customer.isPaid': true,
            })
            .catch((error) => {
                throw new Error(`is paid to true error. customer_id: ${customer_id} `, error);
            })

            const customerEmail = {
                to: email,
                from: {
                    email: 'hello@everygoose.com',
                    name: 'Every Goose order confirmation',
                },
                templateId: 'd-28bdd238699d43a09f4520acb84cfa7c',
                dynamic_template_data: {
                    firstName: firstName,
                    amount: subtotal,
                    last4: last4,
                    estimatedDelivery: estimatedDelivery,
                    quantity: quantity,
                    cardOrCards: cardOrCards,
                    theyOrIt: theyOrIt,
                }
            }

            const imogenEmail = {
                to: 'hello@everygoose.com',
                from: {
                    email: 'hello@everygoose.com',
                    name: 'New order',
                },
                templateId: 'd-31290132706a4eaaa0fa6c85b34a8ec3',
                dynamic_template_data: {
                    total: total,
                    subtotal: subtotal,
                    estimatedDelivery: estimatedDelivery,
                    quantity: quantity,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    addressFirstLine: addressFirst,
                    addressSecondLine: addressSecond,
                    addressThirdLine: addressThird,
                    city: city,
                    county: county,
                    postcode: postcode,
                    deliveryCost: deliveryCharge,
                    phone: phoneNumber,
                    cardTitle: breakdownMapped,
                }
            }

            console.log('sending customer email');
            await sendgrid.send(customerEmail)

            console.log('sending imogen email');
            await sendgrid.send(imogenEmail)

            .catch((error) => {
                throw new Error(`email error. customer_id: ${customer_id} `, error);
            })

            return res.send('/#/done');
            
        } catch (error) {
            console.log('an error occured', error)
            return res.send('/#/sorry');
        }
    });
});

exports.contact = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        console.log('calling contact schema')
        const validationError = contactSchema.validate({
            name: name,
            email: email,
            phone: phone,
            message: message,

        }).error;

        try {
            if (validationError) throw new Error(`form validation error: ${validationError}`);

            const contactEmail = {
                to: 'hello@everygoose.com',
                from: {
                    email: 'hello@everygoose.com',
                    name: 'contact',
                },
                templateId: 'd-2608b42e516e427e82685d3fb18f4e73',
                dynamic_template_data: {
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                }
            }

            console.log('sending contact email');
            await sendgrid.send(contactEmail)

            .catch((error) => {
                throw new Error('email error.', error);
            })
            res.send('success');
        } catch (error) {
            console.log('contact email error', error);
            res.send('error');
        }
    })
});
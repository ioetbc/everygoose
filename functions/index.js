const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripeLoader = require('stripe');
const cors = require('cors')({ origin: true });
const uuid = require('uuidv4').default;
const sendgrid = require('@sendgrid/mail');

// TODO validate on the back end too using JOI

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

exports.payment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        console.log('req.body', req.body)
        try {
            const deliveryCost = 2;
            const total = req.body.basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
            const subtotal = req.body.basket.reduce((a, item) =>  item.price * item.quantity + a, 0) + deliveryCost;
            const quantity = req.body.basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0);
            const customer_id = uuid();
            const timeStamp = Date(Date.now()); 
            const formatTimeStamp = timeStamp.toString();

            const payload = {
                customer: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    customerId: customer_id,
                    timeStamp: formatTimeStamp,
                    items: req.body.basket,
                    addressFirstLine: req.body.addressFirst,
                    addressSecondLine: req.body.addressSecond,
                    addressThirdLine: req.body.addressThird,
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
                amount: 200,
                currency: 'GBP',
                source: req.body.stripeToken,
                description: 'card the customer bought',
            }, { idempotency_key: req.body.idempotencyKey })
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
                to: 'ioetbc@gmail.com',
                from: {
                    email: 'cole-09@hotmail.co.uk',
                    name: 'customer email',
                },
                templateId: 'd-28bdd238699d43a09f4520acb84cfa7c',
                dynamic_template_data: {
                    firstName: req.body.firstName,
                    amount: subtotal,
                    last4: '1234',
                    estimatedDelivery: req.body.estimatedDelivery,
                    quantity: quantity,
                    cardOrCards: req.body.cardOrCards,
                    theyOrIt: req.body.theyOrIt,
                }
            }

            const imogenEmail = {
                to: 'ioetbc@gmail.com',
                from: {
                    email: 'cole-09@hotmail.co.uk',
                    name: 'imogen email',
                },
                templateId: 'd-31290132706a4eaaa0fa6c85b34a8ec3',
                dynamic_template_data: {
                    total: total,
                    subtotal: subtotal,
                    last4: '1234',
                    estimatedDelivery: req.body.estimatedDelivery,
                    quantity: quantity,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    addressFirst: req.body.addressFirst,
                    addressSecond: req.body.addressSecond,
                    addressThird: req.body.addressThird,
                    city: req.body.city,
                    county: req.body.county,
                    postcode: req.body.postcode,
                }
            }

            console.log('sending customer email');
            await sendgrid.send(customerEmail)

            console.log('sending imogen email');
            await sendgrid.send(imogenEmail)

            .catch((error) => {
                throw new Error(`email error. customer_id: ${customer_id} `, error);
            })
            res.send('SUCCESS');
        } catch (error) {
            console.log('an error occured', error)
            res.send('ERROR');
        }
    });
});
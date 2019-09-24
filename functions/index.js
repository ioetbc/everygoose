const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripeLoader = require('stripe');
const cors = require('cors')({ origin: true });
const uuid = require('uuidv4').default;
const sendgrid = require('@sendgrid/mail');

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
    const customer_id = uuid();
    
    cors(req, res, async () => {
        try {
            const payload = {
                customer: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    items: req.body.items,
                    address: req.body.address,
                    phoneNumber: req.body.phoneNumber,
                    isPaid: false,
                }
            }

            const customerRef = db.collection('customers').doc(customer_id);

            console.log('creating customer')
            await customerRef.set(payload)
            .catch((error) => {
                throw new Error('database error', error)
            })

            console.log('attempting to take payment');
            await stripe.charges.create({
                amount: 200,
                currency: 'GBP',
                source: req.body.stripeToken,
                description: 'card the customer bought',
            }, { idempotency_key: req.body.idempotencyKey })
            .catch((error) => {
                throw new Error('payment error', error)
            })

            console.log('updating customer isPaid to true')
            await customerRef.update({
                'customer.isPaid': true,
            })
            .catch((error) => {
                return Error('customer has paid but there was an error updating isPaid to true', error);
            })

            const email = {
                to: 'ioetbc@gmail.com',
                from: {
                    email: 'ioetbc@gmail.com',
                    name: 'william cole',
                },
                templateId: 'd-28bdd238699d43a09f4520acb84cfa7c',
                substitutionWrappers: ['{{', '}}'],      
                substitutions: {
                    firstName: 'william',
                    amount: '20.00',
                    last4: '1234',
                    estimatedDelivery: '12th june',
                }
            }
            console.log('sending email')
            await sendgrid.send(email)
            .catch((error) => {
                throw new Error('error sending emails', error)
            })

            res.redirect('/done');  

        } catch (error) {
            console.log('an error occured', 'customer id: ', customer_id , 'actual error: ', error)
            res.redirect('/sorry');  
        }
    });
});
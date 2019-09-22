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
    cors(req, res, async () => {
        try {
            await stripe.charges.create({
                amount: 200,
                currency: 'GBP',
                source: req.body.stripeToken,
                description: 'card the customer bought',
            }).then(() => {
                const customer_id = uuid();
                const payload = {
                    customer: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        items: req.body.items,
                        address: req.body.address,
                        phoneNumber: req.body.phoneNumber
                    }
                }
                console.log('customer creation');
                return db.collection("customers").doc(customer_id).set(payload)
            })
            .then(() => {
                return console.log('going to send email to imogen');
            })
            .then(() => {
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
                return sendgrid.send(email);
            })
            .catch((error) => {
                console.log('error taking payment', error)
                console.log('email error :(', JSON.stringify(error.response.body, null, 4));
            });
        }
        catch (error) {
            console.log('mega error', error);
        }
        res.send('all successfull');
    });
});
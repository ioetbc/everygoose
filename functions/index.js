const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { FirebaseFunctionsRateLimiter } = require("firebase-functions-rate-limiter");
const stripe = require('stripe')(functions.config().stripe.secret_key)
const uuid = require('uuidv4').default;
const axios = require('axios');

const validateForm = require('./utils/validateForm');
const getDeliveryCharge = require('./utils/deliveryCharge');
const createCustomer = require('./utils/createCustomer');
const capturePaypalPayment = require('./utils/capturePaypalPayment');
const sendCommunications = require('./utils/sendCommunications');

// const serviceAccount = require(functions.config().google.service_account);
const slackUrl = functions.config().slack.api_url;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: functions.config().db.url
// });

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

const limiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
        name: "rate_limiter_collection",
        maxCalls: 2,
        periodSeconds: 15,
    },
    db,
);

exports.payment = functions.https.onRequest(async (req, res) => {
    const quotaExceeded = await limiter.rejectOnQuotaExceededOrRecordUsage();

    if (quotaExceeded) return res.send('Too many requests', 500);

    cors(req, res, async () => {
        const validationSuccess = validateForm(req.body);
        const customerId = uuid();

        try {
            if (!validationSuccess) throw new Error('validation error')
    
            const { basket, stripeToken, idempotencyKey, country, europeanCountries, orderID, productCodes, email } = req.body;
            const total = basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
            const deliveryCharge = getDeliveryCharge(country, europeanCountries, basket, total);
            const subtotal = (total + deliveryCharge).toFixed(2);

            if (req.body.paymentMethod === 'stripe') {
                console.log('calling pre aut');
                const { chargeId, last4 } = await stripe.charges.create({
                    amount: subtotal * 100,
                    currency: 'GBP',
                    source: stripeToken,
                    description: 'Card',
                    capture: false,
                }, { idempotency_key: idempotencyKey })
                    .then((data) => {
                        return { chargeId: data.id, last4: data.payment_method_details.card.last4 } ;
                    })
                    .catch(error => { 
                        console.log('in the catch')
                        throw new Error(error)
                    });

                await createCustomer({...req.body, subtotal, deliveryCharge, customerId }, db)
                    .catch((error) => {
                        throw new Error(error);
                    });

                await stripe.charges.capture(chargeId)
                    .catch((error) => {
                        throw new Error(error);
                    });

                await db.collection('customers').doc(customerId).update({'customer.isPaid': true})
                    .catch(async (error) => {
                        await axios.post(slackUrl, { text: `customer: *${email} ${error}*` });
                    });

                await sendCommunications({...req.body, subtotal, total, deliveryCharge, last4, customerId, productCodes })
                    .catch(async (error) => {
                        await axios.post(slackUrl, { text: `error sending communications for customer: *${customerId} ${error}*` });
                    });

            } else {
                await createCustomer({...req.body, subtotal, deliveryCharge, customerId }, db)
                .catch((error) => {
                    throw new Error(error);
                });

                await capturePaypalPayment(orderID, subtotal)
                    .catch(async (error) => {
                        throw new Error(error);
                    });

                await db.collection('customers').doc(customerId).update({'customer.isPaid': true})
                    .catch(async (error) => {
                        await axios.post(slackUrl, { text: `customer: *${email} ${error}*` });
                    });

                await sendCommunications({...req.body, subtotal, total, deliveryCharge, customerId, productCodes })
                    .catch(async (error) => {
                        await axios.post(slackUrl, { text: `error sending communications. for customer: *${customerId} ${error}*` });
                    });
            }

            try {
                await axios.post(slackUrl, { text: 'Successful purchase', });

            } catch (error) {
                console.log('error calling slack on success', error);
            }

            return res.sendStatus(200);

        } catch (error) {
            console.log('in the catch', error);

            try {
                const slackUrl = functions.config().slack.api_url;
                await axios.post(slackUrl, { text: `customer: *${customerId} ${error}*` });

            } catch (error) {
                console.log('error calling slack', error);
            }

            return res.send(500, { error: error.toString() });
        }
    })
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
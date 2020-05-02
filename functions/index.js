const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { FirebaseFunctionsRateLimiter } = require("firebase-functions-rate-limiter");
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);
const uuid = require('uuidv4').default;
const axios = require('axios');

const validateForm = require('./utils/validateForm');
const getDeliveryCharge = require('./utils/deliveryCharge');
const createCustomer = require('./utils/createCustomer');
const updateCustomer = require('./utils/updateCustomer');
const preAuthPayment = require('./utils/preAuthPayment');
const preAuthPaypalPayment = require('./utils/preAuthPaypalPayment');
const capturePayment = require('./utils/capturePayment');
const sendCommunications = require('./utils/sendCommunications');
const serviceAccount = require("/Users/williamcole/Documents/Free/everygoose-64c129114754.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://everygoose.firebaseio.com"
});

// admin.initializeApp({
//     apiKey: functions.config().db.api_key,
//     authDomain: functions.config().db.auth_domain,
//     databaseURL: functions.config().db.url,
//     projectId: functions.config().db.project_id,
//     messagingSenderId: functions.config().db.message_sender_id,
//     appId: functions.config().db.app_id,
//     storageBucket: functions.config().db.storage_bucket,
// });

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
        console.log('does it start')
        const validationSuccess = validateForm(req.body);

        if (validationSuccess && req.body.basket.length > 0 ) {
            const customerId = uuid();
            try {
                const { basket, stripeToken, idempotencyKey, country, europeanCountries, orderID, productCodes } = req.body;
                const total = basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
                const deliveryCharge = getDeliveryCharge(country, europeanCountries, basket, total);
                const subtotal = (total + deliveryCharge).toFixed(2);

                if (req.body.paymentMethod === 'stripe') {
                    const { chargeId, last4 } = await preAuthPayment(subtotal, stripeToken, idempotencyKey);

                    await createCustomer({...req.body, subtotal, deliveryCharge, customerId }, db);

                    console.log('chargeId', chargeId)

                    await capturePayment(chargeId)

                    await updateCustomer(db, customerId);

                    await sendCommunications({...req.body, subtotal, total, deliveryCharge, last4, customerId, productCodes });

                } else {
                    await preAuthPaypalPayment(orderID, deliveryCharge, subtotal);
                }

                return res.sendStatus(200);

            } catch (error) {
                await axios.post(functions.config().slack.api_url,
                { text: `customer: *${customerId} ${error}* function: ${error.name}` })

                return res.sendStatus(500);
            }
        }
        return res.sendStatus(500)
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
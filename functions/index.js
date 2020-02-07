const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { FirebaseFunctionsRateLimiter } = require("firebase-functions-rate-limiter");
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);
const uuid = require('uuidv4').default;

const validateForm = require('./utils/validateForm');
const getDeliveryCharge = require('./utils/deliveryCharge');
const createCustomer = require('./utils/createCustomer');
const updateCustomer = require('./utils/updateCustomer');
const preAuthPayment = require('./utils/preAuthPayment');
const preAuthPaypalPayment = require('./utils/preAuthPaypalPayment');
const capturePayment = require('./utils/capturePayment');
const sendEmail = require('./utils/sendEmail');

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
        console.log('req', req);
        console.log('ip maybe', req.headers["x-forwarded-for"]);
        console.log('before fun', req.body)
        const validationSuccess = validateForm(req.body);
        console.log('validationSuccess', validationSuccess);
        console.log('req.body.basket.length', req.body.basket.length);
        console.log('req.body.basket.length > 0', req.body.basket.length > 0);


        if (validationSuccess && req.body.basket.length > 0 ) {
            try {
                const { basket, stripeToken, idempotencyKey, country, europeanCountries, orderID } = req.body;

                const total = basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
                const deliveryCharge = getDeliveryCharge(country, europeanCountries, basket, total);
                const customerId = uuid();
                console.log('country', country)
                console.log('europeanCountries', europeanCountries)
                console.log('basket', basket)
                console.log('total', total)
                console.log('delivery charge backend', deliveryCharge);

                const subtotal = (total + deliveryCharge).toFixed(2);

                let chargeId;
                let last4;

                if (req.body.paymentMethod === 'stripe') {
                    const paymentObj = await preAuthPayment(subtotal, stripeToken, idempotencyKey);
                    chargeId = paymentObj.chargeId;
                    last4 = paymentObj.last4;
                } else {
                    await preAuthPaypalPayment(orderID, deliveryCharge, subtotal);
                }

                const customerData = req.body;
                Object.assign(customerData, {
                    subtotal,
                    deliveryCharge,
                    paymentMethod: req.body.paymentMethod,
                    customerId,
                });

                await createCustomer(customerData, db);

                if (req.body.paymentMethod === 'stripe') {
                    stripe.charges.capture(chargeId, (error, charge) => {
                        if (error) {
                            console.log('cepture error', error);       
                            return res.send(500);
                        }
                        return true;
                    });
                }

                await updateCustomer(db, customerId);

                await sendEmail('customer', req.body, subtotal, total, deliveryCharge, last4, customerId);

                await sendEmail('imogen', req.body, subtotal, total, deliveryCharge, customerId);

                return res.send(200);

            } catch (error) {
                console.log('in the catch', error)
                return res.send(500);
            }
        }
        return res.send(500)
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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

const validateForm = require('./utils/validateForm')
const createCustomer = require('./utils/createCustomer');
const preAuthPayment = require('./utils/preAuthPayment');
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

exports.payment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        console.log('before fun', req.body)
        const validationSuccess = validateForm(req.body);
        console.log('validationSuccess', validationSuccess)

        if (validationSuccess) {
            try {
                const { basket, stripeToken, idempotencyKey } = req.body;

                const total = basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
                const deliveryCharge = total > 35 ? 0 : 2;
                const subtotal = (basket.reduce((a, item) =>  item.price * item.quantity + a, 0) + deliveryCharge).toFixed(2);

                let chargeId;
                let last4;

                if (req.body.paymentMethod === 'stripe') {
                    const paymentObj = await preAuthPayment(subtotal, stripeToken, idempotencyKey);
                    chargeId = paymentObj.chargeId;
                    last4 = paymentObj.last4;
                }
        
                await createCustomer(req.body, subtotal, deliveryCharge);

                if (req.body.paymentMethod === 'stripe') {
                    await capturePayment(chargeId);
                }

                await sendEmail('customer', req.body, subtotal, total, deliveryCharge, last4);
        
                await sendEmail('imogen', req.body, subtotal, total, deliveryCharge);
        
                return res.send('/#/done');
                
            } catch (error) {
                console.log('in the catch', error)
                return res.send('/#/sorry');
            }
        }
        return res.send('/#/sorry');
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
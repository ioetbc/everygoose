const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

const validateForm = require('./utils/validateForm');
const getDeliveryCharge = require('./utils/deliveryCharge');
const createCustomer = require('./utils/createCustomer');
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

exports.payment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        console.log('before fun', req.body)
        const validationSuccess = validateForm(req.body);
        console.log('validationSuccess', validationSuccess)

        if (validationSuccess) {
            try {
                const { basket, stripeToken, idempotencyKey, country, europeanCountries, orderID } = req.body;
                const total = basket.reduce((a, item) =>  item.price * item.quantity + a, 0);
                const deliveryCharge = getDeliveryCharge(country, europeanCountries, basket, total);

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
                    await preAuthPaypalPayment(orderID, deliveryCharge);
                }

                const customerData = req.body;
                Object.assign(customerData, {
                    subtotal,
                    deliveryCharge,
                    paymentMethod: req.body.paymentMethod,
                });

                console.log('customerData', customerData);

                await createCustomer(customerData);

                console.log('did it creat the customer?')

                if (req.body.paymentMethod === 'stripe') await capturePayment(chargeId);

                await sendEmail('customer', req.body, subtotal, total, deliveryCharge, last4);

                await sendEmail('imogen', req.body, subtotal, total, deliveryCharge);

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
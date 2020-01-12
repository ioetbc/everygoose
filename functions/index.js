const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const rp = require('request-promise');

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
                // Need to get the delivery charge using the function
                const deliveryCharge = 0;
                const subtotal = (total + deliveryCharge).toFixed(2);

                let chargeId;
                let last4;

                if (req.body.paymentMethod === 'stripe') {
                    const paymentObj = await preAuthPayment(subtotal, stripeToken, idempotencyKey);
                    chargeId = paymentObj.chargeId;
                    last4 = paymentObj.last4;
                } else {
                    const paypalOauthApi = functions.config().paypal.paypal_oauth_api;
                    const paypalOrderApi = functions.config().paypal.paypal_order_api;
                    const paypalClient = functions.config().paypal.paypal_client;
                    const paypalSecret = functions.config().paypal.paypal_secret;

                    const options = {
                        'method': 'POST',
                        'url': 'https://api.sandbox.paypal.com/v1/oauth2/token',
                        'headers': {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Authorization': 'Basic QVd4bWpmOFE5SmVYTzRueUJNSFZIblpZZEE2UEs1U01vZzB1dHVMVjFuazgxRlRQVlZpZDNjSnc2bmdTamhfZld5NVZhNUNsN0JCbEl3UW46RUhmM1NiWGJ5WXd6WXBRUXpyNlhnT0Q3cGJ4MHUzR0ZJNmJMcnNmeG5fNWNqQnRnOXpVcWNqQXB0ck1SYVdtQ2lHM1BpZkFYYXF3WUZDTHg='
                        },
                        form: {
                          'grant_type': 'client_credentials'
                        }
                    };

                    const authToken = await rp(options)
                        .then((result) => {
                            console.log('parsedBody', result);
                            const resultObj = JSON.parse(result);
                            return resultObj.access_token;
                        })
                        .catch((error) => {
                            console.log('request promise error', error);
                            throw new Error(error);
                        });

                    const orderOptions = {
                        'method': 'GET',
                        'url': `https://api.sandbox.paypal.com/v2/checkout/orders/${req.body.orderID}`,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                    };

                    await rp(orderOptions)
                        .then((result) => {
                            console.log('capture body', result);
                            const resultObj = JSON.parse(result);
                            console.log('resultObj', resultObj);

                            const fronEndTotal = resultObj.purchase_units[0].amount.value + deliveryCharge;

                            const backendTotal = subtotal;

                            console.log('frontend total', parseInt(fronEndTotal, 10).toFixed(2));
                            console.log('back end total', parseInt(backendTotal, 10).toFixed(2));

                            console.log('equals?', fronEndTotal === backendTotal);
                            console.log('type of front end', typeof fronEndTotal);
                            console.log('toye of backedn totlal', typeof backendTotal);

                            if (parseInt(fronEndTotal, 10).toFixed(2) !== parseInt(backendTotal, 10).toFixed(2)) throw new Error('difference in totals');

                            return true;
                        })
                        .catch((error) => {
                            console.log('request captutr promise error', error);
                            throw new Error(error);
                        });
                }

                // const customerData = req.body;
                // Object.assign(customerData, { subtotal, deliveryCharge });

                // console.log('customerData', customerData);

                // await createCustomer(customerData);

                // console.log('did it creat the customer?')

                // if (req.body.paymentMethod === 'stripe') {
                //     await capturePayment(chargeId);
                // }

                // await sendEmail('customer', req.body, subtotal, total, deliveryCharge, last4);

                // await sendEmail('imogen', req.body, subtotal, total, deliveryCharge);

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
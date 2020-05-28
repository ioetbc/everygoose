const functions = require('firebase-functions');
const paypal = require('@paypal/checkout-server-sdk');
  

const preAuthPaypalPayment = async (orderID, subtotal) => {
    const paypalClient = functions.config().paypal.paypal_client;
    const paypalSecret = functions.config().paypal.paypal_secret;

    console.log('paypalClient', paypalClient)

    const environment = new paypal.core.LiveEnvironment(paypalClient, paypalSecret);
    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    return client.execute(request);
}

module.exports = preAuthPaypalPayment;
const functions = require('firebase-functions');
const paypal = require('@paypal/checkout-server-sdk');
  

const preAuthPaypalPayment = async (orderID, subtotal) => {
    const paypalClient = functions.config().paypal.paypal_client;
    const paypalSecret = functions.config().paypal.paypal_secret;

    const environment = new paypal.core.SandboxEnvironment(paypalClient, paypalSecret);
    const client = new paypal.core.PayPalHttpClient(environment);
    
    console.log('subtotal', subtotal)
    console.log('orderID', orderID)

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    return client.execute(request);
}

module.exports = preAuthPaypalPayment;
const functions = require('firebase-functions');
const rp = require('request-promise');

const preAuthPaypalPayment = async (orderID, deliveryCharge, subtotal) => {
    const paypalOauthApi = functions.config().paypal.paypal_oauth_api;
    const paypalOrderApi = functions.config().paypal.paypal_order_api;
    const paypalClient = functions.config().paypal.paypal_client;
    const paypalSecret = functions.config().paypal.paypal_secret;
    const encodedCredentials = Buffer.from(paypalClient + ':' + paypalSecret).toString('base64');

    const authOptions = {
        method: 'POST',
        url: paypalOauthApi,
        headers: {
            ContentType: 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedCredentials}`
        },
        form: {
            grant_type: 'client_credentials'
        }
    };

    const authToken = await rp(authOptions)
        .then((result) => {
            console.log('parsedBody', result);
            const resultObj = JSON.parse(result);
            return resultObj.access_token;
        })
        .catch((error) => {
            throw new Error('Could not get access token', error);
        });

    const orderOptions = {
        method: 'GET',
        url: paypalOrderApi + orderID,
        headers: {
            ContentType: 'application/json',
            Authorization: `Bearer ${authToken}`
        },
    };

    await rp(orderOptions)
        .then((result) => {
            const resultObj = JSON.parse(result);
            const fronEndTotal = resultObj.purchase_units[0].amount.value;

            console.log('fronEndTotal', fronEndTotal)
            console.log('subtotal', subtotal)

            if (fronEndTotal !== subtotal) throw new Error('difference in totals');

            return true;
        })
        .catch((error) => {
            console.log('request capture promise error', error);
            throw new Error(error);
        });
}

module.exports = preAuthPaypalPayment;
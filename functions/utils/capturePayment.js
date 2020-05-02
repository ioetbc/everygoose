const functions = require('firebase-functions');
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);

const capturePayment = async chargeId => {
    await stripe.charges.capture(chargeId, (error) => {
        if (error) {
            console.log('error in capture payment', error)    
            throw new Error(error);
        }
    });
}

module.exports = capturePayment;
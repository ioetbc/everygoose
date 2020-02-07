const functions = require('firebase-functions');
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);

const capturePayment = async (stripeToken) => {
    await stripe.charges.capture(stripeToken, (error, charge) => {
            if (error) return error;
            return true;
        }
    );
}

module.exports = capturePayment;
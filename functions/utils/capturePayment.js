const functions = require('firebase-functions');
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);

const capturePayment = async (stripeToken) => {
    stripe.charges.capture(
        stripeToken,
        (error, charge) => {
            if (error) {
                console.log('throwing capture error :(', error)
                return new Error('payment error.', error);
            }
            console.log('captured the charge this is the object', charge)
            return true;
        }
    );
}

module.exports = capturePayment;
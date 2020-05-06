const functions = require('firebase-functions');
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);

const preAuthPayment = async (subtotal, stripeToken, idempotency_key) => {
    return stripe.charges.create({
        amount: subtotal * 100,
        currency: 'GBP',
        source: stripeToken,
        description: 'Card',
        capture: false,
    }, { idempotency_key });
}

module.exports = preAuthPayment;

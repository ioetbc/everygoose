const functions = require('firebase-functions');
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);

const preAuthPayment = async (subtotal, stripeToken, idempotency_key) => {
    await stripe.charges.create({
        amount: subtotal * 100,
        currency: 'GBP',
        source: stripeToken,
        description: 'Card',
        capture: false,
    }, { idempotency_key })
    .then((data) => { return { chargeId: data.id, last4: data.payment_method_details.card.last4 } })
    .catch(error => { 
        console.log('pre auth error', error)
        throw new Error(error)    
    });
}

module.exports = preAuthPayment;

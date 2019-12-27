const functions = require('firebase-functions');
const stripeLoader = require('stripe');
const stripe = new stripeLoader(functions.config().stripe.secret_key);

const preAuthPayment = async (subtotal, stripeToken, idempotencyKey) => {
    console.log('about to call stripe', subtotal, stripeToken, idempotencyKey)
    const charge = await stripe.charges.create({
        amount: subtotal * 100,
        currency: 'GBP',
        source: stripeToken,
        description: 'Card',
        capture: false,
    }, { idempotency_key: idempotencyKey })
    .then((data) => {
        const chargeObj = {
            chargeId: data.id,
            last4: data.payment_method_details.card.last4
        }
        console.log('cunt', chargeObj);

        return chargeObj;
    })
    .catch((error) => {
        console.log('error calling pre auth stripe', error);
        throw new Error(error);
    });

    return Promise.resolve(charge);
}

module.exports = preAuthPayment;
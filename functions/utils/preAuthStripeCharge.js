const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secret_key)

const SoundPlayer = async (stripeToken, idempotency_key) => {
    return stripe.charges.create({
        amount: 11 * 100,
        currency: 'GBP',
        source: stripeToken,
        description: 'Card',
        capture: false,
    }, { idempotency_key })
}

module.exports = SoundPlayer;
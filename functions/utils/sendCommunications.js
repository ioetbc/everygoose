const functions = require('firebase-functions');
const sendgrid = require('@sendgrid/mail');
const sendgridSecret = functions.config().sendgrid.secret_key;
sendgrid.setApiKey(sendgridSecret);

const sendEmail = async (payload) => {

    const {
        firstName,
        lastName,
        email,
        addressFirst,
        addressSecond,
        addressThird,
        city,
        breakdown,
        county,
        postcode,
        estimatedDelivery,
        cardOrCards,
        theyOrIt,
        phoneNumber,
        basket,
        paymentMethod,
        subtotal,
        total,
        deliveryCharge,
        last4,
        customerId,
        productCodes
    } = payload

    const quantity = basket.reduce((a, item) => parseInt(item.quantity, 10) + a, 0);
    const breakdownMapped = breakdown.map(u => `${u.quantity} x ${u.title}`);

    const orderReciept = {
        to: 'hello@everygoose.com',
        from: {
            email: 'hello+shop@everygoose.com',
        },
        templateId: 'd-31290132706a4eaaa0fa6c85b34a8ec3',
        dynamic_template_data: {
            total: total,
            subtotal: subtotal,
            estimatedDelivery: estimatedDelivery,
            quantity: quantity,
            firstName: firstName,
            lastName: lastName,
            email: email,
            addressFirstLine: addressFirst,
            addressSecondLine: addressSecond,
            addressThirdLine: addressThird,
            city: city,
            county: county,
            postcode: postcode,
            deliveryCost: deliveryCharge,
            phone: phoneNumber,
            cardTitle: breakdownMapped,
            paymentMethod,
            productCodes,
        }
    }

    await sendgrid.send(orderReciept)

    const customerConfirmation = {
        to: email,
        from: {
            email: 'hello@everygoose.com',
        },
        templateId: 'd-28bdd238699d43a09f4520acb84cfa7c',
        dynamic_template_data: {
            firstName: firstName,
            amount: subtotal,
            transactionInfo: paymentMethod === 'stripe' ? `to your card ending in ${last4}` : 'to your Paypal account',
            estimatedDelivery: estimatedDelivery,
            quantity: quantity,
            cardOrCards: cardOrCards,
            theyOrIt: theyOrIt,
        }
    }

    return sendgrid.send(customerConfirmation)
}

module.exports = sendEmail;
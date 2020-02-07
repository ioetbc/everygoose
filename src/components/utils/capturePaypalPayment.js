import React from 'react';
import handleOrder from './handleOrder';
import loadingState from './LoadingState';

const capturePaypalPayment = (details) => {
    console.log('details m8', details)
    window.paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
				purchase_units: [
					{
						amount: {
							currency_code: 'GBP',
							value: details.subTotal,
						},
					},
				],
			});
        },
        onApprove: async (data, actions) => {
            const payload = {
                firstName: details.firstName,
                lastName: details.lastName,
                email: details.email,
                addressFirstLine: details.addressFirstLine,
                addressSecondLine: details.addressSecondLine,
                addressThirdLine: details.addressThirdLine,
                city: details.city,
                county: details.county,
                country: details.country,
                postcode: details.postcode,
                phone: details.phone,
                paymentMethod: 'stripe',
                subTotal: details.subTotal,
                orderID: data.orderID,
                europeanCountries: details.europeanCountries,
            }

            loadingState();
            const approveOrder = await handleOrder(payload, 'paypal');

            if (approveOrder.status === 200) {
				actions.order.capture()
					.then(() => window.location='/#/done')
					.catch(() => window.location='/#/sorry');
            } else {
				window.location='/#/sorry';
            }
        }
    }).render('#paypal-button-container');
}

export default capturePaypalPayment;



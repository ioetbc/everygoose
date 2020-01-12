import handleOrder from './handleOrder';

const capturePaypalPayment = (details) => {
  console.log('in the new function that handles paypal capture', details)
    window.paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
				// add more context to the transaction here?
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
                addressFirst: details.addressFirst,
                addressSecond: details.addressSecond,
                addressThird: details.addressThird,
                city: details.city,
                county: details.county,
                postcode: details.postcode,
                phoneNumber: details.phoneNumber,
                paymentMethod: 'stripe',
                subTotal: details.subTotal,
                orderID: data.orderID,
            }

            const approveOrder = await handleOrder(payload, 'paypal');

            console.log('approveOrder?', approveOrder);

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



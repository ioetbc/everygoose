import handleOrder from './handleOrder';
import loadingState from './LoadingState';

const capturePaypalPayment = (payload) => {
    window.paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
				purchase_units: [
					{
						amount: {
							currency_code: 'GBP',
							value: payload.subTotal,
						},
					},
				],
			});
        },
        onApprove: async (data, actions) => {
            console.log('payload m8', payload)
            const lads = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                addressFirstLine: payload.addressFirstLine,
                addressSecondLine: payload.addressSecondLine,
                addressThirdLine: payload.addressThirdLine,
                city: payload.city,
                county: payload.county,
                country: payload.country,
                postcode: payload.postcode,
                phone: payload.phone,
                paymentMethod: 'stripe',
                subTotal: payload.subTotal,
                orderID: data.orderID,
                europeanCountries: payload.europeanCountries,
                product_code: payload.product_code
            }

            loadingState();
            const approveOrder = await handleOrder(lads, 'paypal');

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



import handleOrder from './handleOrder';

const capturePaypalPayment = (fuck) => {
  console.log('in the new function that handles paypal capture', fuck)
    window.paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: fuck.subTotal,
                  },
                },
              ],
            });
        },
        onApprove: async (data, actions) => { 
            const payload = {
                firstName: fuck.firstName,
                lastName: fuck.lastName,
                email: fuck.email,
                addressFirst: fuck.addressFirst,
                addressSecond: fuck.addressSecond,
                addressThird: fuck.addressThird,
                city: fuck.city,
                county: fuck.county,
                postcode: fuck.postcode,
                phoneNumber: fuck.phoneNumber,
                paymentMethod: 'stripe',
                subTotal: fuck.subTotal,
                orderID: data.orderID,
            }

            const approveOrder = await handleOrder(payload, 'paypal');

            console.log('approveOrder', approveOrder);

            if (approveOrder.status === 200) {
				actions.order.capture().then(() => window.location='/#/done');
            } else {
				window.location='/#/sorry';
			}
        }
    }).render('#paypal-button-container');
}

export default capturePaypalPayment;



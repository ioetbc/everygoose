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
                    // value: payload.subTotal,
                    value: 1,
                  },
                },
              ],
            });
        },
        onApprove: (data, actions) => { 
            console.log('the data in onapprove order', fuck)
            console.log('the payload in onapprove order', fuck.subTotal)
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
            }
    
            return actions.order.capture().then(function() {
                console.log('fuck', fuck);
                handleOrder(payload, 'paypal');
            });
        }
    }).render('#paypal-button-container');
}

export default capturePaypalPayment;



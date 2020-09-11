async function createCustomer ({ customerObject, db, isPaid = false }) {
    const timeStamp = Date(Date.now()); 
    const formatTimeStamp = timeStamp.toString();

    const items = customerObject.basket.map(a => {
        const productObject = {
            title: a.title,
            product_type: a.product_type,
            quantity: a.quantity
        }
        return productObject;
    });

    const payload = {
        customer: {
            firstName: customerObject.firstName,
            lastName: customerObject.lastName,
            email: customerObject.email,
            phoneNumber: customerObject.phoneNumber,
            customerId: customerObject.customerId,
            timeStamp: formatTimeStamp,
            items: items,   
            addressFirstLine: customerObject.addressFirst,
            addressSecondLine: customerObject.addressSecond || false,
            addressThirdLine: customerObject.addressThird || false,
            city: customerObject.city,
            county: customerObject.county,
            postcode: customerObject.postcode,
            totalCost: customerObject.subtotal,
            deliveryCharge: customerObject.deliveryCharge,
            paymentMethod: customerObject.paymentMethod,
            isPaid,
        }
    }

    return db.collection('customers').doc(customerObject.customerId).set(payload);
}

module.exports = createCustomer;
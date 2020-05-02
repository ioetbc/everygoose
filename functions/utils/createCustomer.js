const createCustomer = async (customer, db) => {
    const timeStamp = Date(Date.now()); 
    const formatTimeStamp = timeStamp.toString();

    const items = customer.basket.map(a => {
        const productObject = {
            title: a.title,
            product_type: a.product_type,
            quantity: a.quantity

        }
        return productObject;
    });

    const payload = {
        customer: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            customerId: customer.customerId,
            timeStamp: formatTimeStamp,
            items: items,   
            addressFirstLine: customer.addressFirst,
            addressSecondLine: customer.addressSecond || false,
            addressThirdLine: customer.addressThird || false,
            city: customer.city,
            county: customer.county,
            postcode: customer.postcode,
            totalCost: customer.subtotal,
            deliveryCharge: customer.deliveryCharge,
            paymentMethod: customer.paymentMethod,
            isPaid: false,
        }
    }

    return db.collection('customers').doc(customer.customerId).set(payload)
    .catch((error) => {
        throw new Error(error);
    });
}

module.exports = createCustomer;
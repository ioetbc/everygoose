const createCustomer = async (data, db) => {
    const timeStamp = Date(Date.now()); 
    const formatTimeStamp = timeStamp.toString();
    const items = data.basket.map(a => {
        return `${a.quantity} x ${a.product_type} ${a.title}`;
    });
    
    console.log('the data i the create customer function', data)

    const payload = {
        customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            customerId: data.customerId,
            timeStamp: formatTimeStamp,
            items: items,   
            addressFirstLine: data.addressFirst,
            addressSecondLine: data.addressSecond || false,
            addressThirdLine: data.addressThird || false,
            city: data.city,
            county: data.county,
            postcode: data.postcode,
            totalCost: data.subtotal,
            deliveryCharge: data.deliveryCharge,
            paymentMethod: data.paymentMethod,
            isPaid: false,
        }
    }

    console.log('the payload for the db', payload);

    return db.collection('customers').doc(data.customerId).set(payload)
    .catch((error) => {
        throw new Error(error);
    });
}

module.exports = createCustomer;
const admin = require('firebase-admin');
const uuid = require('uuidv4').default;

const createCustomer = async (data, subtotal, deliveryCharge) => {
    const {
        firstName,
        lastName,
        email,
        addressFirst,
        addressSecond,
        addressThird,
        city,
        county,
        postcode,
        basket,
        phoneNumber,
    } = data;
    const timeStamp = Date(Date.now()); 
    const formatTimeStamp = timeStamp.toString();
    const items = basket.map(a => a.title);
    const db = admin.firestore();
    const customer_id = uuid();
    const payload = {
        customer: {
            firstName,
            lastName,
            email,
            phoneNumber,
            customerId: customer_id,
            timeStamp: formatTimeStamp,    
            items,
            addressFirstLine: addressFirst,
            addressSecondLine: addressSecond || false,
            addressThirdLine: addressThird || false,
            city,
            county,
            postcode,
            totalCost: subtotal,
            deliveryCharge,
        }
    }

    return db.collection('customers').doc(customer_id).set(payload)
    .catch((error) => {
        throw new Error(error);
    });
}

module.exports = createCustomer;
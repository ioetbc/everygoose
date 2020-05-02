const updateCustomer = async (db, customerId) => {
    return db.collection('customers').doc(customerId).update({'customer.isPaid': true})
        .catch((error) => {
            throw new Error(`error updating isPaid to true for: ${customerId}`, error);
        });
}

module.exports = updateCustomer;
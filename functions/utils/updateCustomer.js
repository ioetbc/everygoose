const updateCustomer = (customerRef, customer_id) => {
    customerRef.update({'customer.isPaid': true})
        .catch((error) => new Error(`is paid to true error. customer_id: ${customer_id} `, error));
}

module.exports = updateCustomer;
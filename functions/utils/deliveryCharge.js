const { includes } = require('lodash');

function deliveryCharge(country, europeanCountries, basket, total) {
    let charge = [];
    const europeanCountry = europeanCountries.map(c => c.name);
    const isUK = country.includes('United Kingdom');

    if (!country && !europeanCountries) return '2.00';

    if (includes(basket.map(i => i.product_type), 'print')) {
        if (isUK) charge.push(2.50);
    }

    if (includes(basket.map(i => i.product_type), 'print') && !isUK && !includes(europeanCountry, country)) {
        charge.push(6);
    }

    if (total > 35 && isUK) {
        charge.push('freeDelivery')
    }

    if (includes(country, 'Australia')) {
        const productType = basket.map(i => i.product_type);

        if (includes(productType, 'bundle')) {
            charge.push(5.15);
        }
    }

    if (europeanCountries) {
        const productType = basket.map(i => i.product_type);

        if (includes(productType, 'card')) {
            if (includes(europeanCountry, country) || isUK) {
                if (isUK) {
                    charge.push(1.05);
                } else {
                    charge.push(2)
                }
            } else {
                charge.push(3.50);
            }
        }
        if (includes(productType, 'bundle')) {
            if (!includes(europeanCountry, country) && !isUK) charge.push(4.85);
            if (isUK) charge.push(1.50);
            if (includes(europeanCountry, country) && !isUK) charge.push(3.85);
        }
    }


    const deliveryCharge = includes(charge, 'freeDelivery') ? 0 : Math.max(...charge);


    return deliveryCharge;
}

module.exports = deliveryCharge;
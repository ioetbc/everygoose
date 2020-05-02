const { includes } = require('lodash');

const deliveryCharge = (country, europeanCountries, basket, total) => {
    let charge = [];

    if (includes(basket.map(i => i.product_type), 'print')) {
        if (includes(country, 'United Kingdom')) charge.push(0);
    }

    if (includes(basket.map(i => i.product_type), 'print') && !includes(country, 'United Kingdom')) {
        charge.push(15);
    }

    if (total > 35 && includes(country, 'United Kingdom')) {
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
        const europenCountry = europeanCountries.map(c => c.name);

        if (includes(productType, 'card')) {
            // row
            if (!includes(europenCountry, country) && !includes(country, 'United Kingdom')) charge.push(2.50);
            // uk
            if (includes(country, 'United Kingdom')) charge.push(1);
            // europe
            if (includes(europenCountry, country) && !includes(country, 'United Kingdom') ) charge.push(2);
        }
        if (includes(productType, 'bundle')) {
            if (!includes(europenCountry, country) && !includes(country, 'United Kingdom')) charge.push(4.85);
            if (includes(country, 'United Kingdom')) charge.push(1.50);
            if (includes(europenCountry, country) && !includes(country, 'United Kingdom')) charge.push(3.85);
        }
    }

    const deliveryCharge = includes(charge, 'freeDelivery') ? 0 : Math.max(...charge);

    return deliveryCharge;
}

module.exports = deliveryCharge;
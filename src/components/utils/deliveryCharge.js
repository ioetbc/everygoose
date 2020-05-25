import { includes } from 'lodash';

export default function deliveryCharge(country, europeanCountries, basket, total) {
    let charge = [];
    const europeanCountry = europeanCountries.map(c => c.name);

    if (!country && !europeanCountries) return '2.00';

    if (includes(basket.map(i => i.product_type), 'print')) {
        if (includes(country, 'United Kingdom')) charge.push(2.50);
    }

    if (includes(basket.map(i => i.product_type), 'print') && !includes(country, 'United Kingdom') && !includes(europeanCountry, country)) {
        charge.push(6);
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

        if (includes(productType, 'card')) {
            if (includes(europeanCountry, country)) {
                if (includes(country, 'United Kingdom')) {
                    charge.push(1.05);
                } else {
                    charge.push(2)
                }
            } else {
                charge.push(3.50);
            }
        }
        if (includes(productType, 'bundle')) {
            if (!includes(europeanCountry, country) && !includes(country, 'United Kingdom')) charge.push(4.85);
            if (includes(country, 'United Kingdom')) charge.push(1.50);
            if (includes(europeanCountry, country) && !includes(country, 'United Kingdom')) charge.push(3.85);
        }
    }


    const deliveryCharge = includes(charge, 'freeDelivery') ? 0 : Math.max(...charge);


    return deliveryCharge;
}
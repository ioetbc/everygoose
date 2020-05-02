import { includes } from 'lodash';

export default function deliveryCharge(country, europeanCountries, basket, total) {
    let charge = [];

    console.log('wtf', country)

    if (!country && !europeanCountries) return '2.00';

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

    console.log('country', country)
    console.log('europeanCountries', europeanCountries)
    console.log('productType', basket.map(i => i.product_type))

    if (europeanCountries) {
        const productType = basket.map(i => i.product_type);
        const europenCountry = europeanCountries.map(c => c.name);

        console.log('europenCountry', europenCountry)

        if (includes(productType, 'card')) {
            // row
            console.log('row', includes(europenCountry, country))
            console.log('uk true?', !includes(country, 'United Kingdom'))



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

    console.log('the massive charge', charge);
    console.log('deliveryCharge', deliveryCharge);


    return deliveryCharge;
}
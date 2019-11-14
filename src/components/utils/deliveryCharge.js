import { includes } from 'lodash';

export default function deliveryCharge(country, europeanCountries, basket, total) {
    let charge = 2.50;

    if (total > 35 && includes(country, 'United Kingdom')) {
        charge = 0;
        return charge;
    } else if (europeanCountries) {
        const productType = basket.map(i => i.product_type);
        const europenCountry = europeanCountries.map(c => c.name);

        if (includes(productType, 'card')) {
            if (includes(country, 'United Kingdom')) charge = 1;
            if (includes(europenCountry, country) && !includes(country, 'United Kingdom') ) charge = 2;
        }
        if (includes(productType, 'bundle')) {
            charge = 4.85;
            if (includes(country, 'United Kingdom')) charge = 1.50;
            if (includes(europenCountry, country) && !includes(country, 'United Kingdom')) charge = 3.85;
        }
    }
    return charge;
}
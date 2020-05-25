import deliveryCharge from '../deliveryCharge';

const total = 12.5;

it('UK card charge', async () => {
    const basket = [
        {
            product_type: 'card',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const country = 'United Kingdom';
    const charge = deliveryCharge(country, europeanCountries, basket, total);
    expect(charge).toEqual(1.05);
});

it('EUROPE card charge', async () => {
    const basket = [
        {
            product_type: 'card',
        },
    ];
    const europeanCountries = [ {
        name: 'Spain'
    }];
    const country = 'Spain';
    const charge = deliveryCharge(country, europeanCountries, basket, total);
    expect(charge).toEqual(2);
});

it('REST OF THE WORLD card charge', async () => {
    const basket = [
        {
            product_type: 'card',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const shippingCountries = 'Canada';
    const charge = deliveryCharge(shippingCountries, europeanCountries, basket, total);
    expect(charge).toEqual(3.50);
});

it('UK bundle charge', () => {
    const basket = [
        {
            product_type: 'bundle',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const country = 'United Kingdom';
    const charge = deliveryCharge(country, europeanCountries, basket, total);
    console.log('charge bindle', charge)
    expect(charge).toEqual(1.50);
});

it('EUROPE bundle charge', () => {
    const basket = [
        {
            product_type: 'bundle',
        },
    ];
    const europeanCountries = [ {
        name: 'Spain'
    }];
    const country = 'Spain';
    const charge = deliveryCharge(country, europeanCountries, basket, total);
    expect(charge).toEqual(3.85);
});

it('AUSTRALIAN bundle charge', () => {
    const basket = [
        {
            product_type: 'bundle',
        },
    ];
    const europeanCountries = [ {
        name: 'Spain'
    }];
    const country = 'Australia';
    const charge = deliveryCharge(country, europeanCountries, basket, total);
    expect(charge).toEqual(5.15);
});

it('REST OF WORLD bundle charge', () => {
    const basket = [
        {
            product_type: 'bundle',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const shippingCountries = ['Canada'];
    const charge = deliveryCharge(shippingCountries, europeanCountries, basket, total);
    expect(charge).toEqual(4.85);
});

it('applies FREE delivery if you are a UK customer & total > 35', () => {
    const basket = [
        {
            product_type: 'card',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const charge = deliveryCharge('United Kingdom', europeanCountries, basket, 40);
    expect(charge).toEqual(0);
});

it('DOES NOT apply FREE delivery if you are a NOT a UK customer but total > 35', () => {
    const basket = [
        {
            product_type: 'card',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const country = 'Canada';
    const charge = deliveryCharge(country, europeanCountries, basket, 40);
    expect(charge).toEqual(3.50);
});

it('includes australian card and australian bundle', () => {
    const basket = [
        {
            product_type: 'card',
        },
        {
            product_type: 'bundle',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const country = ['Australia'];
    const charge = deliveryCharge(country, europeanCountries, basket, 40);
    expect(charge).toEqual(5.15);
});

it('includes australian card and a european bundle', () => {
    const basket = [
        {
            product_type: 'card',
        },
        {
            product_type: 'bundle',
        },
    ];
    const europeanCountries = [ {
        name: 'United Kingdom'
    }];
    const shippingCountries = ['Australia'];
    const charge = deliveryCharge(shippingCountries, europeanCountries, basket, 40);
    expect(charge).toEqual(5.15);
});

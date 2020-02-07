import updateBasket from '../updateBasket';

it('adds product to basket', () => {
    const item = { title: 'Seal of Approval Engagement card' }
	const basket = updateBasket(item);
    expect(basket.length).toEqual(1);
});

it('DOES NOT add product to basket if the product already ecists', () => {
    updateBasket({ title: 'Seal of Approval Engagement card' });
	const basket = updateBasket({ title: 'Seal of Approval Engagement card' });

    expect(basket.length).toEqual(1);
});

it('updates the product quantity', () => {
    const basket = updateBasket(
        { title: 'Seal of Approval Engagement card' },
        {
            key: 'quantity',
            value: 5,
        }
    );

    expect(basket[0].quantity).toEqual(5);
});

it('removes an item from the basket', () => {
    const basket = updateBasket({ title: 'Seal of Approval Engagement card' }, false, true );
    expect(basket.length).toEqual(0);
});

it('it toggle between framing a print', () => {
    let basket = updateBasket(
        { title: 'Seal of Approval Engagement card' },
        {
            key: 'framed',
            value: true,
        }
    );
    expect(basket[0].framed).toEqual(true);
    basket = updateBasket(
        { title: 'Seal of Approval Engagement card' },
        {
            key: 'framed',
            value: false,
        }
    );
    expect(basket[0].framed).toEqual(false);
});


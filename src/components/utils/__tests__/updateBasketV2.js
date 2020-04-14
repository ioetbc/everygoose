import { BasketHandler }  from '../updateBasketV2';

it('adds product to basket', () => {
    const basket = [];
    const basketHandler = new BasketHandler({
        item: { title: 'Seal of Approval Engagement card' },
        basket,
    });

	const result = basketHandler.add();
    expect(result.length).toEqual(1);
});

it('does not add if alreadt exists in basket', () => {
    const basket = [{ title: 'Seal of Approval Engagement card' }];
    const basketHandler = new BasketHandler({
        item: { title: 'Seal of Approval Engagement card' },
        basket,
    });

	const result = basketHandler.add();
    expect(result.length).toEqual(1);
});

it('updates the product quantity', () => {
    const basket = [{ title: 'Seal of Approval Engagement card' }];
    const basketHandler = new BasketHandler({
        item: { title: 'Seal of Approval Engagement card' },
        basket,
        node: { key: 'quantity', value: 5 }
    });

    const result = basketHandler.update();
    expect(result[0].quantity).toEqual(5);
});

it('removes item from basket', () => {
    const basket = [{ title: 'card 1' }, { title: 'card 2' }];
    const basketHandler = new BasketHandler({
        basket,
        item: { title: 'card 2'}
    });

    const result = basketHandler.remove();
    expect(result.length).toEqual(1);
    expect(result[0].title).toEqual('card 1');
});

it('blats the basket', () => {
    const basket = [{ title: 'Seal of Approval Engagement card' }];
    const basketHandler = new BasketHandler({
        basket,
    });

    const result = basketHandler.blat();
    expect(result.length).toEqual(0);
});

import { BasketHandler } from './updateBasketV2';

const amendItem = (e, basket, product) => {
    const value = e.target.value
    const key = e.target.name;

    if (key === 'quantity') {
        product.quantity = value
    }

    if (key === 'framed') {
        product.framed = value
    }
    
    if (key === 'quantity') {
        product.quantity = value
    }
    
    if (key === 'size') {
        product.size = value
        if (value === 'a3') {
            product.product_dimensions = product.product_dimensions_a3
        } else if (value === 'a4') {
            product.product_dimensions = product.product_dimensions_a4
        }
    }

    if (product.size === 'a4' && product.framed === 'false') {
        product.price = product.a4_price
    }

    if (product.size === 'a4' && product.framed === 'true') {
        product.price = product.a4_framed_price
    }

    if (product.size === 'a3' && product.framed === 'false') {
        product.price = product.a3_price
    }

    if (product.size === 'a3' && product.framed === 'true') {
        product.price = product.a3_framed_price
    }

    const basketHandler = new BasketHandler({
        item: product,
        node: { key, value },
        basket,
    });

    basketHandler.update();

    return product;
};

export default amendItem;
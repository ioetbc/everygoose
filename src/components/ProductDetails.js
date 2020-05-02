import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import getBasket from '../components/utils/getBasket';
import getDeliveryCharge from '../components/utils/deliveryCharge';
import getPrice from '../components/utils/getPrice';
import { BasketHandler } from '../components/utils/updateBasketV2';
import amendItem from '../components/utils/amendItem';

import EstimatedDelivery from './utils/EstimatedDelivery';
import Button from './Shared/Button';

class ProductDetails extends Component {
    constructor(props) {
        super(props)
        this.state = { productClone: this.props.product };
    }

    hello(e, basket, product) {
        const amendedItem = amendItem(e, basket, product);

        this.setState({ productClone: amendedItem });
    }

    render() {
        const { product } = this.props;
        const { productClone } = this.state;
        const basket = getBasket();
        const total = getPrice(basket);

        let basketHandler = new BasketHandler({
            item: product,
            basket,
        });

        console.log('basket', basket)

        const cardHeight = get(productClone, 'card_dimensions.height');
        const cardWidth = get(productClone, 'card_dimensions.width');

        let cardSize = '';

        if (cardHeight === 14.8 && cardWidth === 10.5 || cardHeight === 10.5 && cardWidth === 14.8) {
            cardSize = 'A6'
        };

        return (
            <div className="product-details-container">
                <h3>{product.title}</h3>
                <p>{product.description}</p>

                <div className="item-quantity" style={{ display: 'inline-block', marginTop: '20px' }}>
                    <select
                        onChange={(e) => this.hello(e, basket, product)}
                        className="quantity-select"
                        style={{ marginLeft: 0, marginBottom: '12px'  }}
                        name="framed"
                        defaultValue={product.framed}
                    >
                        <option value={false}>standard</option>
                        <option value={true}>framed</option>
                    </select>

                    <select
                        onChange={(e) => this.hello(e, basket, product)}
                        className="quantity-select"
                        style={{ marginLeft: 0 }}
                        name="size"
                        defaultValue={product.size}
                    >
                        <option value={'a4'}>A4</option>
                        <option value={'a3'}>A3</option>
                    </select>
                </div>

                <div className="item-quantity">
                    <select
                        className="quantity-select"
                        onChange={(e) => this.hello(e, basket, product)}
                        defaultValue={product.quantity}
                        name="quantity"
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                </div>

                <ul className="key-features">
                    <li>£{productClone.price * parseInt(productClone.quantity, 10)}</li>
                    <li>{`H${cardHeight}cm x W${cardWidth}cm ${cardSize} folded card`}</li>
                    <li>Delivery from £{getDeliveryCharge('United Kingdom', [{name: 'United Kingdom'}], [{product_type: productClone.product_type}], total).toFixed(2)}</li>
                </ul>
                <Link to={{ pathname: "/checkout", state: { productClone } }}>
                    <Button
                        text="add to basket"
                        onClick={() => basketHandler.add()}
                    />
                </Link>
            </div>
        );
    }   
}

export default ProductDetails;
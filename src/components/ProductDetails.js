import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
                    <li>{productClone.product_dimensions}</li>
                    <li>Delivery from £{getDeliveryCharge('United Kingdom', ['United Kingdom'], basket, total).toFixed(2)}</li>
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
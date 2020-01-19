import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import getBasket from '../components/utils/getBasket';
import updateBasket from '../components/utils/updateBasket';

import EstimatedDelivery from './utils/EstimatedDelivery';
import Button from './Shared/Button';

class ProductDetails extends Component {
    constructor(props) {
        super(props)
        this.state = { READONLYBASKET: getBasket() }
    }

    render() {
        const { product, addToBasket } = this.props;

        const isFramed = this.state.READONLYBASKET.map(i => {
            if (i.title === product.title) {
                return i.framed;
            }
        });

        return (
            <div className="product-details-container">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                {product.product_type === 'bundle' &&
                    <div className="item-quantity" style={{ display: 'inline-block', marginTop: '20px' }}>
                        <select
                            onChange={(e) =>
                                this.setState({
                                    READONLYBASKET: updateBasket(product, { key: 'framed', value: e.target.value })
                                })}
                            className="quantity-select"
                            style={{ marginLeft: 0 }}
                        >
                            <option value={false}>standard</option>
                            <option value={true} selected={isFramed[0] === 'true'}>framed</option>
                        </select>
                    </div>
                }
                <ul className="key-features">
                    <li>£{product.price}</li>
                    <li>{product.product_dimensions}</li>
                    <li>Delivered by {EstimatedDelivery()}</li>
                </ul>
                <Link to={{ pathname: "/checkout", state: { product } }}>
                    <Button
                        product={product}
                        text="add to basket"
                        addToBasket={addToBasket}
                    />
                </Link>
            </div>
        );
    }   
}

export default ProductDetails;
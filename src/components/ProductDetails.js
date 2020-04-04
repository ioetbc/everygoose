import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import getBasket from '../components/utils/getBasket';
import updateBasket from '../components/utils/updateBasket';

import EstimatedDelivery from './utils/EstimatedDelivery';
import Button from './Shared/Button';

class ProductDetails extends Component {
    constructor(props) {
        super(props)
        this.state = { updatedPrint: this.props.product };
        this.updatePrint = this.updatePrint.bind(this);
    }

    updatePrint({ key, value }) {
        const { product } = this.props;

        if (key === 'framed') {
            product.framed = value
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

        this.setState({ updatedPrint: product });


        let basket = JSON.parse(localStorage.getItem('session')) || [];

        basket.map(element => {
            if (element.title === product.title) {
                element.price = product.price;
                element.size = product.size;
                element.framed = product.framed;
            }
        });

        localStorage.setItem('session', JSON.stringify(basket));
    }

    render() {
        const { product, addToBasket } = this.props;
        const { updatedPrint } = this.state;

        return (
            <div className="product-details-container">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                {product.product_type === 'print' &&
                    <div className="item-quantity" style={{ display: 'inline-block', marginTop: '20px' }}>
                        <select
                            onChange={(e) => this.updatePrint({ key: 'framed', value: e.target.value })}
                            className="quantity-select"
                            style={{ marginLeft: 0, marginBottom: '12px'  }}
                        >
                            <option value={false}>standard</option>
                            <option value={true} selected={updatedPrint.framed === 'true'}>framed</option>
                        </select>

                        <select
                            onChange={(e) =>this.updatePrint({ key: 'size', value: e.target.value })}
                            className="quantity-select"
                            style={{ marginLeft: 0 }}
                        >
                            <option value={'a4'}>A4</option>
                            <option value={'a3'} selected={updatedPrint.size === 'a3'}>A3</option>
                        </select>

                    </div>
                }
                <ul className="key-features">
                    <li>£{updatedPrint.price}</li>
                    <li>{updatedPrint.product_dimensions}</li>
                    <li>Delivered by {EstimatedDelivery()}</li>
                </ul>
                <Link to={{ pathname: "/checkout", state: { updatedPrint } }}>
                    <Button
                        product={updatedPrint}
                        text="add to basket"
                        addToBasket={addToBasket}
                    />
                </Link>
            </div>
        );
    }   
}

export default ProductDetails;
import React from 'react';
import { Link } from 'react-router-dom';

import EstimatedDelivery from './utils/EstimatedDelivery';
import Button from './Shared/Button';

const ProductDetails = ({ product, addToBasket }) => {
    return (
        <div className="product-details-container">
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            {product.product_type === 'bundle' &&
                <select onChange={(e) => {
                    product.framed = e.target.value
                    // updateBasket(product, e.target.value);
                }} className="quantity-select">
                    <option value={false} selected={product.framed}>standard</option>
                    <option value={true} selected={product.framed}>framed</option>
                </select>
            }
            <ul className="key-features">
                <li>10.5cm x 14.8cm</li>
                <li>Hand made</li>
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

export default ProductDetails;
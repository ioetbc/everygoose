import React from 'react';
import { Link } from 'react-router-dom';

import EstimatedDelivery from './utils/Estimated';
import Button from './Shared/Button';

const ProductDetails = ({ details, addToBasket }) => {
    return (
        <div className="product-details-container">
            <h3>{details.title}</h3>
            <p>{details.description}</p>
            <ul className="key-features">
                <li>10.5cm x 14.8cm</li>
                <li>hand made</li>
                <li>delivered by {EstimatedDelivery()}</li>
            </ul>
            <Link to={{ pathname: "/checkout", state: { details } }}>
                <Button
                    details={details}
                    text="add to basket"
                    addToBasket={addToBasket}
                />
            </Link>
        </div>
    );
}

export default ProductDetails;
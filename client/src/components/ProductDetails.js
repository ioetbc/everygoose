import React from 'react';
import { Link } from 'react-router-dom';

import Button from './Shared/Button';

const ProductDetails = ({ details, addToBasket }) => {
    return (
        <div className='product-container'>
            <h3>{details.title}</h3>
            <p>{details.description}</p>
            <ul className="list">
                <li>key featuer</li>
                <li>key featuer</li>
                <li>key featuer</li>
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
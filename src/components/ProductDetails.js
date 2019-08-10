import React from 'react';
import { Link } from 'react-router-dom';

import Button from './Shared/Button';

const ProductDetails = ({ details, addToBasket }) => {
        return (
            <div className='product-container'>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab, at facilis eaque accusantium possimus ut numquam itaque aut fuga ipsam laborum veniam modi. Odio ducimus nihil voluptas officiis distinctio quisquam?</p>
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
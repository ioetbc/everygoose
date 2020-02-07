import React from 'react';

const Button = ({ text, product, addToBasket}) => {
        return (
            <button className="button" onClick={() => addToBasket && addToBasket(product)}>
                <p>{text}</p>
            </button>
        );
	}

export default Button;
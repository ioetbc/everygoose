import React from 'react';

const Button = ({ text, details, addToBasket}) => {
        return (
            <button className="button" onClick={() => addToBasket && addToBasket(details)}>
                <p>{text}</p>
            </button>
        );
	}

export default Button;
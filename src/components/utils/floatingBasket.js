
import React from 'react';
import BasketIcon from '../../images/icons/icon-basket.svg';
import getBasket from '../utils/getBasket';

const floatingBasket = () => {
    const basket = getBasket();
    if (basket.length < 1) return null

    return (
        null
        // <div
        //     onClick={() => window.location='/#/checkout'} className="basket-wrapper floating-basket"
        // >
        //     <img className="basket-icon" src={BasketIcon}></img>
        //     {basket.length > 0 &&
        //         <div className="basket-amount">{basket && basket.length}</div>
        //     }
        // </div>
    )
}

export default floatingBasket;

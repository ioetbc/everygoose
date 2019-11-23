import React from 'react';
import { uniq } from 'lodash';
import { Link } from 'react-router-dom';
import Basket from '../images/icons/icon-basket.svg';
import getBasket from './utils/getBasket';

export default function Header({ title, shop, navigationItems, handleNavigationFilter }) {
    navigationItems && navigationItems.unshift('all');
    const basket = getBasket();

    return (
        <div className={`header ${shop && 'shop'}`}>
            <h1 className="header-title">{title}</h1>
            {shop && 
                <div className="mobile-filter item-quantity">
                    <select className="quantity-select" style={{ marginLeft: 0 }} onChange={(e) => handleNavigationFilter(e.target.value)}>
                        {uniq(navigationItems).map(navItem => {
                            return <option value={navItem}>{navItem}</option>
                        })}
                    </select>
                </div>
            }
            <Link to={{ pathname: "/checkout" }}>
                <div className="basket-wrapper">
                    <img className="basket-icon" src={Basket}></img>                    
                    {basket.length > 0 &&
                        <div className="basket-amount">{basket && basket.length}</div>
                    }
                </div>
            </Link>
        </div>
    )
}

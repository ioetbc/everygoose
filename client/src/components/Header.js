import React from 'react';
import { uniq } from 'lodash';
import { Link } from 'react-router-dom';
import Basket from '../images/icons/icon-basket.svg';

export default function Header({ title, basket, shop, navigationItems, handleNavigationFilter }) {
    return (
        <div className={`header ${shop && 'shop'}`}>
            <h1 className="header-title">{title}</h1>
            {shop &&
                <div className="mobile-filter item-quantity" style={{ display: 'block' }}>
                    <select className="quantity-select" style={{ marginLeft: 0 }} onChange={(e) => handleNavigationFilter(e.target.value)}>
                        {uniq(navigationItems).map(navItem =>
                            <option value={navItem}>{navItem}</option>
                        )}
                    </select>
                    <p style={{ marginTop: '8px' }} onClick={() => handleNavigationFilter('reset')}>reset</p>
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

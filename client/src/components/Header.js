import React from 'react';
import { uniq } from 'lodash';

export default function Header({ title, basket, shop, navigationItems, handleNavigationFilter }) {
    return (
        <div className={`header ${shop && 'shop'}`}>
            <h1 className="header-title">{title}</h1>
            <div className="mobile-filter">
                <select onChange={(e) => handleNavigationFilter(e.target.value)}>
                    {uniq(navigationItems).map(navItem =>
                        <option value={navItem}>{navItem}</option>
                    )}
                </select>
                <p onClick={() => handleNavigationFilter('reset')}>reset</p>
            </div>
            <p className="header-basket">
                basket ({basket && basket.length})
            </p>
        </div>
    )
}

import React from 'react';

import getBasket from '../components/utils/getBasket';

import ScrollToTop from '../components/utils/ScrollTop';
import SelectedItem from '../components/SelectedItem'; 
import Overview from '../components/Overview';

const Checkout = ({ removeItem }) => {
    const basket = getBasket();
    console.log('basket from checkout', basket);
    return [
        <ScrollToTop />,
        <main className="main-content">
            <div className="checkout-not-equal">
                <SelectedItem
                    removeItem={removeItem}
                    basket={basket}
                />
                <Overview
                    basket={basket}
                />
            </div>
        </main>,
    ];
}

export default Checkout;
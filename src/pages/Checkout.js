import React from 'react';

import SelectedItem from '../components/SelectedItem'; 
import Overview from '../components/Overview';

const Checkout = ({ selectQuantity, basket, removeItem }) => {
    return (
        <main className="main-content">
            <div className="checkout-not-equal">
                <SelectedItem
                    basket={basket}
                    selectQuantity={selectQuantity}
                    removeItem={removeItem}
                />
                <Overview
                    basket={basket}
                />
            </div>
        </main>
    );
}

export default Checkout;
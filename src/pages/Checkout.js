import React, { Component } from 'react';

import getBasket from '../components/utils/getBasket';
import updateBasket from '../components/utils/updateBasket';
import getPrice from '../components/utils/getPrice';


import ScrollToTop from '../components/utils/ScrollTop';
import SelectedItem from '../components/SelectedItem'; 
import Overview from '../components/Overview';

class Checkout extends Component {
    constructor(props) {
        super(props)
        this.state = { READONLYBASKET: getBasket() }
        this.updateCheckout = this.updateCheckout.bind(this);
    }

    updateCheckout(e, item, update) {
        this.setState({
            READONLYBASKET: updateBasket(item, { key: update, value: e.target.value }, update === 'remove' ? true : false),
        });
    }

    render() {
        const basket = getBasket();
        const total = getPrice(basket);
        const subTotal = (parseFloat(total) + (this.state.deliveryCharge || 0)).toFixed(2);
        return [
            <ScrollToTop />,
            <main className="main-content">
                <div className="checkout-not-equal">
                    <SelectedItem
                        updateCheckout={this.updateCheckout}
                        READONLYBASKET={this.state.READONLYBASKET}
                    />
                    <Overview
                        READONLYBASKET={this.state.READONLYBASKET}
                        checkout
                        subTotal={subTotal}
                    />
                </div>
            </main>,
        ];
    }
}

export default Checkout;
import React, { Component, Fragment } from 'react';

import getBasket from '../components/utils/getBasket';
import updateBasket from '../components/utils/updateBasket';
import getPrice from '../components/utils/getPrice';


import ScrollToTop from '../components/utils/ScrollTop';
import SelectedItem from '../components/SelectedItem'; 
import Overview from '../components/Overview';
import getDeliveryCharge from '../components/utils/deliveryCharge';

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
        const deliveryCharge = getDeliveryCharge(null, null, basket, total);
        const subTotal = (parseFloat(total) + (parseInt(deliveryCharge, 10) || 0)).toFixed(2);

        return (
            <Fragment>
                <ScrollToTop />
                <main className="main-content">
                    <div className="checkout-not-equal">
                        <SelectedItem
                            updateCheckout={this.updateCheckout}
                            READONLYBASKET={this.state.READONLYBASKET}
                        />
                        <Overview
                            checkout
                            deliveryCharge={deliveryCharge}
                            subTotal={subTotal}
                        />
                    </div>
                </main>
            </Fragment>
        );
    }
}

export default Checkout;
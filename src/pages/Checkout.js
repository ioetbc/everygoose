import React, { Component, Fragment } from 'react';

import getBasket from '../components/utils/getBasket';
import getPrice from '../components/utils/getPrice';

import ScrollToTop from '../components/utils/ScrollTop';
import SelectedItem from '../components/SelectedItem'; 
import Overview from '../components/Overview';
import getDeliveryCharge from '../components/utils/deliveryCharge';
import { BasketHandler } from '../components/utils/updateBasketV2';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = { amendedBasket: getBasket() };
        this.removeItem = this.removeItem.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
    }

    removeItem = ({ item, basket }) => {
        let basketHandler = new BasketHandler({
            item,
            basket,
        });
    
        const amendedBasket = basketHandler.remove();
        this.setState({ amendedBasket });    
    }

    updateQuantity = (e, item, basket) => {
        const key = 'quantity';
        const value = e.target.value;

        let basketHandler = new BasketHandler({
            item,
            node: { key, value },
            basket,
            store: true,
        });
    
        const amendedBasket = basketHandler.update();
        this.setState({ amendedBasket });    
    }

    render() {
        const { amendedBasket } = this.state;
        const basket = getBasket();
        const total = getPrice(basket);
        const deliveryCharge = getDeliveryCharge('United Kingdom', [{name: 'United Kingdom'}], basket, total);
        const subTotal = (parseFloat(total) + (deliveryCharge || 0)).toFixed(2);

        return (
            <Fragment>
                <ScrollToTop />
                <main className="main-content">
                    <div className="checkout-not-equal">
                        <SelectedItem
                            basket={amendedBasket}
                            removeItem={this.removeItem}
                            updateQuantity={this.updateQuantity}
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
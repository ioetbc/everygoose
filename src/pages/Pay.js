import React, { Component, Fragment } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { Link } from 'react-router-dom';
import axios from 'axios';

import getDeliveryCharge from '../components/utils/deliveryCharge';
import getPrice from '../components/utils/getPrice';

import ScrollToTop from '../components/utils/ScrollTop';
import Overview from '../components/Overview';
import PayForm from '../components/PayForm'
import getBasket from '../components/utils/getBasket';

class Product extends Component {
    constructor(props) {
        const basket = getBasket();
        const total = getPrice(basket);
        const defaultDeliveryCharge = getDeliveryCharge('United Kingdom', [{name: 'United Kingdom'}], basket, total);
        super(props);
        this.state = { europeanCountries: [], deliveryCharge: defaultDeliveryCharge}
        this.handleCountry = this.handleCountry.bind(this);
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_EUROPEAN_COUNTRIES)
        .then(res => {
          const europeanCountries = res.data;
          this.setState({ europeanCountries });
        });

        var loadPaypalScript = function (src) {
            var tag = document.createElement('script');
            tag.async = false;
            tag.src = src;
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(tag);
          }
      
          loadPaypalScript(process.env.REACT_APP_PAYPAL_CLIENT_URL);
    }

    handleCountry(country) {
        const basket = getBasket();
        const total = getPrice(basket);
        const deliveryCharge = getDeliveryCharge(country, this.state.europeanCountries, basket, total);
        this.setState({ deliveryCharge });
    }

    render() {
        const basket = getBasket();
        const total = getPrice(basket);
        const subTotal = (parseFloat(total) + this.state.deliveryCharge).toFixed(2);

        if (basket) {
            return (
                <Fragment>
                    <ScrollToTop />
                    <main className="main-content">
                        <div className="checkout-not-equal">
                            <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}>
                                <Elements>
                                    <PayForm
                                        basket={basket}
                                        handleCountry={this.handleCountry}
                                        subTotal={subTotal}
                                        europeanCountries={this.state.europeanCountries}
                                    />
                                </Elements>
                            </StripeProvider>
                            <Overview
                                basket={basket}
                                payPage
                                deliveryCharge={this.state.deliveryCharge.toFixed(2)}
                                europeanCountries={this.state.europeanCountries}
                                subTotal={subTotal}
                            />
                        </div>
                    </main>
                </Fragment>
            ); 
        } else {
            return (
                <main className="main-content">
                    <p>No items selected, <Link to={{ pathname: "/"}}>back to shop</Link></p>        
                </main>
                )
            }
        }
    }

export default Product;
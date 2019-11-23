import React, { Component } from 'react';
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
        super(props);
        this.state = { europeanCountries: [], deliveryCharge: 1 }
        this.handleCountry = this.handleCountry.bind(this);
    }

    componentDidMount() {
        axios.get('https://restcountries.eu/rest/v2/region/europe')
        .then(res => {
          const europeanCountries = res.data;
          this.setState({ europeanCountries });
        });
    }

    handleCountry(country) {
        const basket = getBasket();
        const total = getPrice(basket);
        const deliveryCharge = getDeliveryCharge(country, this.state.europeanCountries, basket, total);
        this.setState({ deliveryCharge });
    }

    render() {
        const basket = getBasket();

        if (basket) {
            return [
                <ScrollToTop />,
                <main className="main-content">
                    <div className="checkout-not-equal">
                        <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}>
                        <Elements>
                            <PayForm
                                basket={basket}
                                handleCountry={this.handleCountry}
                            />
                        </Elements>
                        </StripeProvider>
                        <Overview
                            basket={basket}
                            payPage
                            deliveryCharge={this.state.deliveryCharge}
                            europeanCountries={this.state.europeanCountries}
                        />
                    </div>
                </main>,
            ]; 
        } else {
            return (
                <main className="main-content">
                <p>No items selected, <Link to={{ pathname: "/"}}>back to homepage</Link></p>        
                </main>
                )
            }
        }
    }

export default Product;
import React, { Component } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { Link } from 'react-router-dom';
import axios from 'axios';

import getDeliveryCharge from '../components/utils/deliveryCharge';
import getPrice from '../components/utils/getPrice';

import ScrollToTop from '../components/utils/ScrollTop';
import Overview from '../components/Overview';
import PayForm from '../components/PayForm'

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = { europeanCountries: [], deliveryCharge: 1 }
        this.handleCountry = this.handleCountry.bind(this);
    }


    // TODO put this logic on the checkout page
    componentDidMount() {
        axios.get('https://restcountries.eu/rest/v2/region/europe')
        .then(res => {
          const europeanCountries = res.data;
          this.setState({ europeanCountries });
        });
    }

    handleCountry(country) {
        console.log('long', JSON.stringify(this.props.location.state.basket, null, 4))
        const total = getPrice(this.props.location.state.basket);
        const deliveryCharge = getDeliveryCharge(country, this.state.europeanCountries, this.props.location.state.basket, total);
        this.setState({ deliveryCharge });
    }

    render() {
        const { location } = this.props;
        if (location.state) {
            return [
                <ScrollToTop />,
                <main className="main-content">
                    <div className="checkout-not-equal">
                        <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}>
                        <Elements>
                            <PayForm
                                basket={location.state.basket}
                                handleCountry={this.handleCountry}
                            />
                        </Elements>
                        </StripeProvider>
                        <Overview
                            basket={location.state.basket}
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